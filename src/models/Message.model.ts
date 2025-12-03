import { db } from "../config/db";
import { Message } from "../types/interface";

export const getAllMessages = async (): Promise<Message[]> => {
	const [results] = await db.query('SELECT id, senderid, receiverid, groupid, content, sentat, status::int as status, messageid FROM message');
	return results as Message[];
};

export const getMessageById = async (id: number): Promise<Message[]> => {
	const [results] = await db.query('SELECT id, senderid, receiverid, groupid, content, sentat, status::int as status, messageid FROM message WHERE id = $1', [id]);
	return results as Message[];
};

export const createMessage = async (senderid: number, receiverid: number, groupid: number | null, content: string, sentat: string, status: number, messageid: number): Promise<Message[]> => {
	const [results] = await db.query('INSERT INTO message (senderid, receiverid, groupid, content, sentat, status, messageid) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [senderid, receiverid, groupid, content, sentat, status, messageid]);
	return results as Message[];
};

export const updateMessage = async (id: number, senderid: number, receiverid: number, groupid: number | null, content: string, sentat: string, status: number, messageid: number): Promise<Message[]> => {
	const [results] = await db.query('UPDATE message SET senderid = $1, receiverid = $2, groupid = $3, content = $4, sentat = $5, status = $6, messageid = $7 WHERE id = $8 RETURNING *', [senderid, receiverid, groupid, content, sentat, status, messageid, id]);
	return results as Message[];
};

export const deleteMessage = async (id: number): Promise<Message[]> => {
	const [results] = await db.query('DELETE FROM message WHERE id = $1 RETURNING *', [id]);
	return results as Message[];
};

export const getLastMessagesByUserId = async (userId: number): Promise<Message[]> => {
	const [results] = await db.query(`
		SELECT m.*, cg.name AS groupname, cg.avatar AS groupavatar
FROM message m
LEFT JOIN chatgroup cg ON cg.id = m.groupid
WHERE m.id IN (
	-- Lấy id tin nhắn mới nhất cho mỗi đoạn chat (group hoặc 1-1)
	SELECT MAX(m2.id)
	FROM message m2
	WHERE 
	  (m2.senderid = $1 OR m2.receiverid = $2 OR m2.groupid IN (
		  SELECT groupid FROM groupmember WHERE userid = $3
	  ))
	GROUP BY 
	  CASE 
		WHEN m2.groupid IS NOT NULL THEN m2.groupid::text  -- group chat
		ELSE 
		  -- chat riêng thì gom theo cặp user không phân biệt ai gửi ai
		  LEAST(m2.senderid, m2.receiverid)::text || '_' || GREATEST(m2.senderid, m2.receiverid)::text
	  END
)
ORDER BY m.sentat DESC;
	`, [userId, userId, userId]);

	return results as Message[];
};
