import { Request, Response } from "express";
import { getAllChatGroupsService, getChatGroupByIdService, createChatGroupService, updateChatGroupService, deleteChatGroupService } from "../services/ChatGroup.service";

export const getAllChatGroupsController = async (req: Request, res: Response) => {
    try {
        const data = await getAllChatGroupsService();
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const getChatGroupByIdController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const data = await getChatGroupByIdService(parseInt(id));
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const createChatGroupController = async (req: Request, res: Response) => {
    try {
        const {name, avatar, creatorid, createdat, status} = req.body;
        const data = await createChatGroupService(name, avatar, creatorid, createdat, status);
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const updateChatGroupController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const {name, avatar, status} = req.body;
        const data = await updateChatGroupService(parseInt(id), name, avatar, status);
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const deleteChatGroupController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const data = await deleteChatGroupService(parseInt(id));
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};