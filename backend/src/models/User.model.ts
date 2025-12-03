import { db } from "../config/db";
import { User } from "../types/interface";



export const getAllUsers = async (): Promise<User[]> => {
	const [results] = await db.query('SELECT id, username, password, birthday, gender, phone, avatar, email, createat, status::int as status FROM "user"');
	return results as User[];
};

export const getUserById = async (email: string): Promise<User[]> => {
	const [results] = await db.query('SELECT id, username, password, birthday, gender, phone, avatar, email, createat, status::int as status FROM "user" WHERE email = $1', [email]);
	return results as User[];
};

export const createUser = async (username: string, password: string, birthday: Date, avatar: string, phone: string, email: string, createat: Date): Promise<any> => {
	const [results] = await db.query('INSERT INTO "user" (username, password, birthday, avatar, phone, email, createat) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [username, password, birthday, avatar, phone, email, createat]);
	return {
		success: true,
		message: 'User created successfully',
		data: results
	};
};

export const updateUserDynamic = async (email: string, fieldsToUpdate: Partial<{ 
	username: string, 
	birthday: Date,  
	gender: string,
	phone: string,
	avatar: string,
	status: number
  }>) => {
	const keys = Object.keys(fieldsToUpdate);
	if (keys.length === 0) {
	  throw new Error('Không có thông tin nào để cập nhật');
	}
  
	const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(', ');
	const values = keys.map(key => (fieldsToUpdate as any)[key]);
  
	const query = `UPDATE "user" SET ${setClause} WHERE email = $${keys.length + 1} RETURNING *`;
	const [result] = await db.query(query, [...values, email]);
  
	return result;
  };

  
export const deleteUser = async (email: string): Promise<any> => {
	const [results] = await db.query('DELETE FROM "user" WHERE email = $1 RETURNING *', [email]);
	return {
		success: true,
		message: 'User deleted successfully',
		data: results
	};
};

export const updatePassword = async (email: string, password: string): Promise<any> => {
	const [results] = await db.query('UPDATE "user" SET password = $1 WHERE email = $2 RETURNING *', [password, email]);
	return {
		success: true,
		message: 'Password updated successfully',
		data: results
	};
};

export const updateAvatar = async (email: string, avatarUrl: string): Promise<any> => {
	const [results] = await db.query('UPDATE "user" SET avatar = $1 WHERE email = $2 RETURNING *', [avatarUrl, email]);
	return {
		success: true,
		message: 'Avatar updated successfully',
		data: results
	};
};
