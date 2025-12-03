import { FriendShip } from "../types/interface";
import { db } from "../config/db";

export const getAllFriendShip = async (): Promise<FriendShip[]> => {
	const [results] = await db.query('SELECT id, userid, sentat, status::int as status FROM friendship');
	return results as FriendShip[];
};

export const getFriendShipById = async (id: number): Promise<FriendShip[]> => {
	const [results] = await db.query('SELECT * FROM friendship WHERE id = $1', [id]);
	return results as FriendShip[];
};

export const createFriendShip = async (userid: number, sentat: number, status: number): Promise<any> => {
	const [results] = await db.query('INSERT INTO friendship (userid, sentat, status) VALUES ($1, $2, $3) RETURNING *', [userid, sentat, status]);
	return results;
   
};

export const updateFriendShip = async (id: number, userid: number, sentat: number, status: number): Promise<any> => {
	const [results] = await db.query('UPDATE friendship SET userid = $1, sentat = $2, status = $3  WHERE id = $4 RETURNING *', [userid, sentat, status, id]);
	return results as FriendShip[];
};

export const deleteFriendShip = async (id: number): Promise<any> => {
	const [results] = await db.query('DELETE FROM friendship WHERE id = $1 RETURNING *', [id]);
	return results;
};
