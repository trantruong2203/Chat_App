import { Request, Response } from "express";
import { createMessageImg, deleteMessageImg, getAllMessageImgs, getMessageImgById, updateMessageImg } from "../services/MessageImg.service";

export const getMessageImgsController = async (req: Request, res: Response) => {
    try {
        const data = await getAllMessageImgs();
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const getMessageImgByIdController = async (req: Request, res: Response) => {
    try {
        const data = await getMessageImgById(parseInt(req.params.id));
        if (!data) {
            return res.status(404).json({message: "MessageImg not found"});
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};  

export const createMessageImgController = async (req: Request, res: Response) => {
    const { id, imgurl, messageid } = req.body;
    try {
        const data = await createMessageImg(id, imgurl, messageid);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const updateMessageImgController = async (req: Request, res: Response) => {
    const {id} = req.params;
    const { imgurl, messageid } = req.body;
    try {
        const data = await updateMessageImg(parseInt(id), imgurl, messageid);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const deleteMessageImgController = async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
         const data = await deleteMessageImg(parseInt(id));
         res.status(204).json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};
