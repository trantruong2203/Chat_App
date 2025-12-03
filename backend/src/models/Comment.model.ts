import { db } from "../config/db";
import { Comment } from "../types/interface";

export const getAllComments = async (): Promise<Comment[]> => {
	const [results] = await db.query(`
		SELECT * from comment c
		ORDER BY c.createdat DESC
	`);
	return results as Comment[];
};

export const getCommentById = async (id: number): Promise<Comment[]> => {
	const [results] = await db.query(`
		SELECT c.*, u.username, u.avatar 
		FROM comment c 
		LEFT JOIN "user" u ON c.userid = u.id 
		WHERE c.id = $1
	`, [id]);
	return results as Comment[];
};

export const getCommentsByPostId = async (postId: number): Promise<Comment[]> => {
	const [results] = await db.query(`
		SELECT c.*, u.username, u.avatar 
		FROM comment c 
		LEFT JOIN "user" u ON c.userid = u.id 
		WHERE c.postid = $1 
		ORDER BY c.createdat DESC
	`, [postId]);
	return results as Comment[];
};

export const getCommentReplies = async (commentId: number): Promise<Comment[]> => {
	const [results] = await db.query(`
		SELECT c.*, u.username, u.avatar 
		FROM comment c 
		LEFT JOIN "user" u ON c.userid = u.id 
		WHERE c.commentid = $1 
		ORDER BY c.createdat ASC
	`, [commentId]);
	return results as Comment[];
};

export const createComment = async (
	userid: number, 
	postid: number, 
	content: string, 
	createdat: string,
	iconid?: number,
	imgurl?: string,
	commentid?: number
): Promise<any> => {
	const [results] = await db.query(`
		INSERT INTO comment (userid, postid, content, createdat, iconid, imgurl, commentid) 
		VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
	`, [userid, postid, content, createdat, iconid || null, imgurl || null, commentid || null]);
	
	return results;
};

export const updateCommentDynamic = async (id: number, fieldsToUpdate: Partial<{
	content: string,
	iconid: number,
	imgurl: string
}>) => {
	const keys = Object.keys(fieldsToUpdate);
	if (keys.length === 0) {
		throw new Error('Không có thông tin nào để cập nhật');
	}

	const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(', ');
	const values = keys.map(key => (fieldsToUpdate as any)[key]);

	const query = `UPDATE comment SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
	const [result] = await db.query(query, [...values, id]);

	return result;
};

export const deleteComment = async (id: number): Promise<any> => {
	// First delete all replies to this comment
	await db.query('DELETE FROM comment WHERE commentid = $1', [id]);
	
	// Then delete the comment itself
	const [results] = await db.query('DELETE FROM comment WHERE id = $1 RETURNING *', [id]);
	
	return {
		success: true,
		message: 'Comment and its replies deleted successfully',
		data: results
	};
};

export const checkCommentOwnership = async (commentId: number, userId: number): Promise<boolean> => {
	const [results] = await db.query('SELECT userid FROM comment WHERE id = $1', [commentId]);
	const comment = results as any[];
	return comment.length > 0 && comment[0].userid === userId;
};

export const checkPostOwnership = async (postId: number, userId: number): Promise<boolean> => {
	const [results] = await db.query('SELECT userid FROM post WHERE id = $1', [postId]);
	const post = results as any[];
	return post.length > 0 && post[0].userid === userId;
};

export const getCommentCount = async (postId: number): Promise<number> => {
	const [results] = await db.query('SELECT COUNT(*)::int as count FROM comment WHERE postid = $1', [postId]);
	const count = results as any[];
	return count[0].count;
};
