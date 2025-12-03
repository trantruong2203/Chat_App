import { Request, Response } from "express";
import { createGroupMemberService, deleteGroupMemberService, getGroupMemberByIdService, getAllGroupMembersService, updateGroupMemberService } from "../services/GroupMember.service";

export const createGroupMemberController = async (req: Request, res: Response) => {
    try {
        const {groupid, userid, joinedat, roleid} = req.body;
        const data = await createGroupMemberService(parseInt(groupid), parseInt(userid), new Date(joinedat), parseInt(roleid));
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const getGroupMemberController = async (req: Request, res: Response) => {
    try {
        const data = await getAllGroupMembersService();
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const getGroupMemberByIdController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const data = await getGroupMemberByIdService(parseInt(id));
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const updateGroupMemberController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const {groupid, userid, joinedat, roleid} = req.body;
        const data = await updateGroupMemberService(parseInt(id), parseInt(groupid), parseInt(userid), new Date(joinedat), parseInt(roleid));
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const deleteGroupMemberController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const data = await deleteGroupMemberService(parseInt(id));
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};