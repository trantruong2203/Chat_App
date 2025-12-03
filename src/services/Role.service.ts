import { Role } from "../models/Role.model";
import { db } from "../config/db";

export const getAllRoles = async (): Promise<Role[]> => {
	const [results] = await db.query('SELECT * FROM role');
	return results as Role[];
};

export const getRoleById = async (id: number): Promise<Role[]> => {
	const [results] = await db.query('SELECT * FROM role WHERE id = $1', [id]);
	return results as Role[];
};

export const createRole = async (id: number, role: string): Promise<Role[]> => {
	const [results] = await db.query('INSERT INTO role (id, role) VALUES ($1, $2) RETURNING *', [id, role]);
	return results as Role[];
};

export const updateRole = async (id: number, role: string): Promise<Role[]> => {
	const [results] = await db.query('UPDATE role SET role = $1 WHERE id = $2 RETURNING *', [role, id]);
	return results as Role[];
};

export const deleteRole = async (id: number): Promise<Role[]> => {
	const [results] = await db.query('DELETE FROM role WHERE id = $1 RETURNING *', [id]);
	return results as Role[];
};