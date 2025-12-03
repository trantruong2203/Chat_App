import * as Account from '../models/User.model';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
const SECRET = process.env.SECRET;

export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    Account.getAllUsers()
      .then((results: any) => {
        resolve(results);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const getUserByAccount = (account: string) => {
  return new Promise((resolve, reject) => {
    Account.getUserById(account)
      .then((results: any) => {
        resolve(results);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};



export const login = (email: string, password: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await Account.getUserById(email);
      if (results.length === 0) return reject({ status: 401, message: 'email không tồn tại' });

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return reject({ status: 401, message: 'Sai mật khẩu' });
      // Tạo token JWT với thời gian hết hạn là 2 giờ
      const token = jwt.sign({ email: user.email }, SECRET || '', { expiresIn: '2h' });
      resolve({ token });
    } catch (err) {
      reject({ status: 500, message: 'Lỗi truy vấn', error: err });
    }
  });
};

export const createUser = async (username: string, password: string, email: string, phone: string, birthday: string, avatar: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Mã hóa mật khẩu trước khi lưu vào database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const result = await Account.createUser(
        username,
        hashedPassword,
        new Date(birthday),
        avatar,
        phone,
        email,
        new Date()
      );
      resolve({ message: 'Đăng ký thành công', user: (result.data && result.data[0]) || null });
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY' || err.code === '23505') {
        return reject({ status: 400, message: 'email đã tồn tại' });
      }
      return reject({ status: 500, message: 'Lỗi server khi tạo tài khoản', error: err });
    }
  });
};

export const updateUser = async (
  email: string,
  data: Partial<{ username: string, birthday: Date, gender: string, phone: string,avatar: string, status: number }>
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await Account.getUserById(email);
      if (!user || user.length === 0) {
        return reject({ status: 404, message: 'Không tìm thấy người dùng' });
      }

      const result = await Account.updateUserDynamic(email, data);
      resolve({ message: 'Cập nhật thành công', data: result });
    } catch (err: any) {
      reject({ status: 500, message: 'Lỗi cập nhật', error: err });
    }
  });
};


export const deleteUser = async (email: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Lấy thông tin người dùng để lấy ID
      const user = await Account.getUserById(email);
      if (!user || user.length === 0) {
        return reject({ status: 404, message: 'Không tìm thấy người dùng' });
      }

      // Xóa người dùng theo ID
      const result = await Account.deleteUser(email);
      resolve({ message: 'Xóa người dùng thành công', data: result });
    } catch (err: any) {
      reject({ status: 500, message: 'Lỗi khi xóa người dùng', error: err });
    }
  });
};

export const updatedPassword = async (email: string, password: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Account.updatePassword(email, password);
      resolve({ message: 'Cập nhật mật khẩu thành công', data: result });
    } catch (err: any) {
      reject({ status: 500, message: 'Lỗi cập nhật mật khẩu', error: err });
    }
  });
};

export const updatedAvatar = async (email: string, avatarUrl: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Account.updateAvatar(email, avatarUrl);
      resolve({ message: 'Cập nhật ảnh đại diện thành công', data: result });
    } catch (err: any) {
      reject({ status: 500, message: 'Lỗi cập nhật ảnh đại diện', error: err });
    }
  });
};