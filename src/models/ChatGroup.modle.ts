import { db } from "../config/db";
import { ChatGroup } from "../types/interface";



export const getAllChatGroups = async (): Promise<ChatGroup[]> => {
	const [results] = await db.query('SELECT id, name, avatar, creatorid, createdat, status::int as status FROM chatgroup');
	return results as ChatGroup[];
};

export const getChatGroupById = async (id: number): Promise<ChatGroup[]> => {
	const [results] = await db.query('SELECT id, name, avatar, creatorid, createdat, status::int as status FROM chatgroup WHERE id = $1', [id]);
	return results as ChatGroup[];
};

export const createChatGroup = async (name: string, avatar: string, creatorid: number, createdat: string, status: number): Promise<any> => {
	const [results] = await db.query('INSERT INTO chatgroup (name, avatar, creatorid, createdat, status) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, avatar, creatorid, createdat, status]);
	return {
		success: true,
		message: 'Chat group created successfully',
		data: results
	};
};

export const updateChatGroupDynamic = async (id: number, fieldsToUpdate: Partial<{ 
	name: string, 
	avatar: string,
	status: number
  }>) => {
	const keys = Object.keys(fieldsToUpdate);
	if (keys.length === 0) {
	  throw new Error('Không có thông tin nào để cập nhật');
	}
  
	const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(', ');
	const values = keys.map(key => (fieldsToUpdate as any)[key]);
  
	const query = `UPDATE chatgroup SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
	const [result] = await db.query(query, [...values, id]);
  
	return result;
  };

  
export const deleteChatGroup = async (id: number): Promise<any> => {
	const [results] = await db.query('DELETE FROM chatgroup WHERE id = $1 RETURNING *', [id]);
	return {
		success: true,
		message: 'Chat group deleted successfully',
		data: results
	};
};


