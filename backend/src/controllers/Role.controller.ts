import { Request, Response } from "express";
import { getAllRoles, getRoleById, createRole, updateRole, deleteRole } from "../services/Role.service";

export const getAllRolesController = async (req: Request, res: Response) => {
    try {
        const data = await getAllRoles();
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const getRoleByIdController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const data = await getRoleById(parseInt(id));
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const createRoleController = async (req: Request, res: Response) => {
    try {
        const {id, role} = req.body;
        const data = await createRole(parseInt(id), role);
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const updateRoleController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const {role} = req.body;
        const data = await updateRole(parseInt(id), role);
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const deleteRoleController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const data = await deleteRole(parseInt(id));
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};