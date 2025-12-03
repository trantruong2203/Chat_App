import { MessageImg } from "../models/MessageImg.model";

import { db } from '../config/db';

export const getAllMessageImgs = async () : Promise<MessageImg[]> => {
    const [results] = await db.query('SELECT * FROM messageimg');
    return results as MessageImg[];
};

export const getMessageImgById = async (id: number) : Promise<MessageImg[]> => {
    const [results] = await db.query('SELECT * FROM messageimg WHERE id = $1', [id]);
    return results as MessageImg[];
};

export const createMessageImg = async (id: number, imgurl: string, messageid: number) : Promise<MessageImg[]> => {
  const [results] = await db.query('INSERT INTO messageimg (id, imgurl, messageid) VALUES ($1, $2, $3) RETURNING *', [id, imgurl, messageid]);
  return results as MessageImg[];
};

  export const updateMessageImg = async (id: number, imgurl: string, messageid: number) : Promise<MessageImg[]> => {
  const [results] = await db.query('UPDATE messageimg SET imgurl = $1, messageid = $2 WHERE id = $3 RETURNING *', [imgurl, messageid, id]);
  return results as MessageImg[];
};

export const deleteMessageImg = async (id: number) : Promise<MessageImg[]> => {
  const [results] = await db.query('DELETE FROM messageimg WHERE id = $1 RETURNING *', [id]);
  return results as MessageImg[];
};
