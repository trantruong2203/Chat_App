import { Request, Response } from "express";
import { getAllPostsService, getPostByIdService, createPostService, updatePostService, deletePostService } from "../services/Post.service";

export const getAllPostsController = async (req: Request, res: Response) => {
    try {
        const data = await getAllPostsService();
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const getPostByIdController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const data = await getPostByIdService(parseInt(id));
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const createPostController = async (req: Request, res: Response) => {
    try {
        const {userid, content, createdat, status} = req.body;
        const data = await createPostService(userid, content, createdat, status);
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const updatePostController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const {userid, content, status} = req.body;
        const data = await updatePostService(parseInt(id), userid, content, status);
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const deletePostController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const data = await deletePostService(parseInt(id));
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};