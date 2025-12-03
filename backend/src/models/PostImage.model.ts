
import { db } from "../config/db";
import { PostImage } from "../types/interface";



export const getPostImages = async (postid: number): Promise<PostImage[]> => {
	const [results] = await db.query('SELECT id, postid, imgurl FROM postimage WHERE postid = $1', [postid]);
	return results as PostImage[];
};

export const createPostImage = async (postid: number, imgurl: string): Promise<PostImage[]> => {
	const [results] = await db.query('INSERT INTO postimage (postid, imgurl) VALUES ($1, $2) RETURNING * ', [postid, imgurl]);
	return results as PostImage[];
};

export const deletePostImage = async (id: number): Promise<any> => {
	const [results] = await db.query('DELETE FROM postimage WHERE id = $1 RETURNING *', [id]);
	return {
		success: true,
		message: 'Post image deleted successfully',
		data: results
	};
};

export const updatePostImage = async (id: number, fieldsToUpdate: Partial<{ 
	postid: number, 
	imgurl: string
  }>) => {
	const keys = Object.keys(fieldsToUpdate);
	if (keys.length === 0) {
	  throw new Error('No information to update');
	}
  
	const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(', ');
	const values = keys.map(key => (fieldsToUpdate as any)[key]);
  
	const query = `UPDATE postimage SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
	const [result] = await db.query(query, [...values, id]);
  
	return result;
  };

  
export const deletePostImageByPostId = async (postid: number): Promise<any> => {
	const [results] = await db.query('DELETE FROM postimage WHERE postid = $1 RETURNING *', [postid]);
	return {
		success: true,
		message: 'Post images deleted successfully',
		data: results
	};
};


