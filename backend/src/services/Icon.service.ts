import { Icon } from "../models/Icon.model";
import { db } from '../config/db';

export const getAllIcons = async () : Promise<Icon[]> => {
    const [results] = await db.query('SELECT * FROM icon');
    return results as Icon[];
};

export const getIconById = async (id: number): Promise<Icon[]> => {
  const [results] = await db.query('SELECT * FROM icon WHERE id = $1', [id]);
  return results as Icon[];
};

export const createIcon = async (id: number, icon: string, status: boolean) : Promise<Icon[]> => {
  const [results] = await db.query('INSERT INTO icon (id, icon, status) VALUES ($1, $2, $3) RETURNING *', [id, icon, status]);
  return results as Icon[];
};

  export const updateIcon = async (id: number, icon: string, status: boolean) : Promise<Icon[]> => {
  const [results] = await db.query('UPDATE icon SET icon = $1, status = $2 WHERE id = $3 RETURNING *', [icon, status, id]);
  return results as Icon[];
};

export const deleteIcon = async (id: number) : Promise<Icon[]> => {
  const [results] = await db.query('DELETE FROM icon WHERE id = $1 RETURNING *', [id]);
  return results as Icon[];
};

export const getIconByStatus = async (status: boolean) : Promise<Icon[]> => {
  const [results] = await db.query('SELECT * FROM icon WHERE status = $1', [status]);
  return results as Icon[];
};

export const getIconByIcon = async (icon: string) => {
  const [results] = await db.query('SELECT * FROM icon WHERE icon = $1', [icon]);
  return results as Icon[];
};

// gui yeu request => middleware(filter) => controller (dieu khien) => service (xu ly) => model (ket noi csdl)
