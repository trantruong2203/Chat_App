import { Request, Response } from "express";
import * as FriendShipService from "../services/FriendShip.service";

export const getFriendShipsController = async (req: Request, res: Response) => {
    try {
        const data = await FriendShipService.getAllFriendShips();
        if (!data) {
            return res.status(404).json({message: "Friendship not found"});
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const getFriendShipByIdController = async (req: Request, res: Response) => {
    try {
        const data = await FriendShipService.getFriendShipByIdService(parseInt(req.params.id));
        if (!data) {
            return res.status(404).json({message: "Friendship not found"});
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};  

export const createFriendShipController = async (req: Request, res: Response) => {
    const { userid, sentat, status } = req.body;
    try {
        const data = await FriendShipService.createFriendShipService(parseInt(userid), parseInt(sentat), parseInt(status));
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const updateFriendShipController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userid, sentat, status } = req.body;
    console.log(`Updating friendship with ID: ${id}, UserID: ${userid}, SentAt: ${sentat}, Status: ${status}`);
    try {
        const data = await FriendShipService.updateFriendShipService(parseInt(id), parseInt(userid), sentat, parseInt(status));
        if (!data) {
            return res.status(404).json({message: "Friendship not found"});
        }
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const deleteFriendShipController = async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
         const data = await FriendShipService.deleteFriendShipService(parseInt(id));
         if (!data) {
            return res.status(404).json({message: "Friendship not found"});
         }
         res.status(204).json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};
