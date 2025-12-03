import { Request, Response } from "express";
import { getPostImagesService, getPostImageByIdService, createPostImageService, updatePostImageService, deletePostImageService } from "../services/PostImage.service";

export const getAllPostImagesController = async (req: Request, res: Response) => {
    try {
        const {postid} = req.params;
        const data = await getPostImagesService(parseInt(postid));
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const getPostImageByIdController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const data = await getPostImageByIdService(parseInt(id));
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const createPostImageController = async (req: Request, res: Response) => {
    try {
        const {postid, imgurl} = req.body;
        const data = await createPostImageService(parseInt(postid), imgurl);
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const updatePostImageController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const {postid, imgurl} = req.body;
        const data = await updatePostImageService(parseInt(id), parseInt(postid), imgurl);
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const deletePostImageController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const data = await deletePostImageService(parseInt(id));
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};