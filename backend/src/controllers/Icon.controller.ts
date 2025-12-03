import { Request, Response } from "express";
import { getAllIcons, getIconById, createIcon, updateIcon, deleteIcon } from "../services/Icon.service";

export const getIcons = async (req: Request, res: Response) => {
    try {
        const data = await getAllIcons();
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const getIconByIdController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const data = await getIconById(parseInt(id));
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const createIconController = async (req: Request, res: Response) => {
    try {
        const {id, icon, status} = req.body;
        const data = await createIcon(id, icon, status);
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const updateIconController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const {icon, status} = req.body;
        const data = await updateIcon(parseInt(id), icon, status);
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const deleteIconController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const data = await deleteIcon(parseInt(id));
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};