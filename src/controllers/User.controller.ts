import { NextFunction, Request, Response } from "express";
import * as UserService from '../services/User.service';
import { User } from "../types/interface";
import { log } from "console";

// Không cần import type declaration ở đây


// Thêm interface cho dữ liệu đăng nhập
interface LoginResponse {
    token: string;
    // Thêm các trường khác nếu cần
}

export const getUsersController = async (req: Request, res: Response) => {
    try {
        const data = await UserService.getAllUsers();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const getUserByAccountController = async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
        const data = await UserService.getUserByAccount(email);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        console.log('Login request received:', { email, password });
        // Kiểm tra email và password có được cung cấp không
        const data = await UserService.login(email, password) as LoginResponse;
        //    lưu token vào cookie
        res.cookie('token', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // true khi production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',  // 'none' khi production
            maxAge: 2 * 60 * 60 * 1000, // 2 giờ
        });
        res.status(200).json(data.token);
    } catch (err) {
        next(err);
    }
};

export const createUserController = async (req: Request, res: Response) => {
    const { username, password, email, phone, birthday, avatar } = req.body;
    try {
        const data = await UserService.createUser(username, password, email, phone, birthday, avatar);
        res.status(201).json(data);
    } catch (error: any) {
        if (error.status) {
            res.status(error.status).json({ error: error.message });
        } else {
            res.status(500).json({ error });
        }
    }
};

export const updateUserController = async (req: Request, res: Response) => {
    const email = req.params.email;
    const { username, birthday, gender, phone, avatar, status } = req.body;
  
    const updateData: any = {};
    if (username) updateData.username = username;
    if (birthday) updateData.birthday = birthday;
    if (gender) updateData.gender = gender;
    if (phone) updateData.phone = phone;
    if (avatar) updateData.avatar = avatar;
    if (status) updateData.status = status;
    try {
      const result = await UserService.updateUser(email, updateData);
      res.status(200).json({ message: 'Cập nhật thành công', data: result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

export const deleteUserController = async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
        const data = await UserService.deleteUser(email);
        res.status(204).send();
    } catch (error: any) {
        if (error.status) {
            res.status(error.status).json({ error: error.message });
        } else {
            res.status(500).json({ error });
        }
    }
};

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        res.json({ user: req.user });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};


export const logoutController = async (req: Request, res: Response) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });
        res.status(200).json({ message: 'Đăng xuất thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống khi đăng xuất' });
    }
};

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res.status(401).json({ message: 'Chưa đăng nhập' });
    }

    const { avatarUrl } = req.body;

     console.log('Upload avatar request received:', { email, avatarUrl });
     
    if (!avatarUrl) {
      return res.status(400).json({ message: 'URL ảnh đại diện không được cung cấp' });
    }

    // Cập nhật URL avatar vào MySQL
    await UserService.updatedAvatar(email, avatarUrl);

    // Trả lại user mới đã cập nhật
    const updatedUser = await UserService.getUserByAccount(email) as User[];

    return res.status(200).json({
      message: 'Cập nhật ảnh đại diện thành công',
      user: updatedUser[0]
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi server khi cập nhật ảnh đại diện' });
  }
};

export const updatePasswordController = async (req: Request, res: Response) => {
    const { email } = req.params;
    const { password } = req.body;
    try {
        const data = await UserService.updatedPassword(email, password);
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}



