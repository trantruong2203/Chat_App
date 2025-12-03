import { Request, Response } from "express";
import { countFavoritePostService, createFavoritePostService, deleteFavoritePostService, getAllFavoritePostsService, getFavoritePostByIdService, updateFavoritePostService } from "../services/FavoritePost.sevice";

export const getAllFavoritePostsController = async (req: Request, res: Response) => {
    try {
        const data = await getAllFavoritePostsService();
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const getFavoritePostByIdController = async (req: Request, res: Response) => {
    try {   
        const {id} = req.params;
        const data = await getFavoritePostByIdService(parseInt(id));
        if (!data || data.length === 0) {
            return res.status(404).json({message: "Favorite post not found"});
        }
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({error});
    }
};  

export const createFavoritePostController = async (req: Request, res: Response) => {
    const { userid, postid, createdat, iconid } = req.body;
    try {
        const data = await createFavoritePostService(userid, postid, createdat, iconid);
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const updateFavoritePostController = async (req: Request, res: Response) => {
    const {id} = req.params;
    const { userid, postid, createdat, iconid } = req.body;
    try {
        const data = await updateFavoritePostService(parseInt(id), userid, postid, createdat, iconid);
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const deleteFavoritePostController = async (req: Request, res: Response) => {
    const {postid, userid} = req.params;
    try {
         const data = await deleteFavoritePostService(parseInt(postid), parseInt(userid));
         res.status(200).json(data);
    } catch (error) {
        if (error instanceof Error && error.message === 'Favorite post not found') {
            return res.status(404).json({ message: 'Favorite post not found' });
        }
        res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
    }
};

export const countFavoritePostController = async (req: Request, res: Response) => {
    const {postid} = req.params;
    try {
         const data = await countFavoritePostService(parseInt(postid));
         res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};
