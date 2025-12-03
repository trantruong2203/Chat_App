import { Request, Response } from "express";
import { getAllMessagesService, getMessageByIdService, createMessageService, updateMessageService, deleteMessageService, getLastMessagesByUserIdService } from "../services/Message.service";
import { io } from "../server";

export const getAllMessagesController = async (req: Request, res: Response) => {
    try {
        const data = await getAllMessagesService();
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const getMessageByIdController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const data = await getMessageByIdService(parseInt(id));
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const createMessageController = async (req: Request, res: Response) => {
    try {
        const {senderid, receiverid, groupid, content, sentat, status, messageid} = req.body;
        const result = await createMessageService(senderid, receiverid ?? null, groupid ?? null, content, sentat, status, messageid);
        const createdMessage = result?.data;
        if (createdMessage) {
            io.emit("receiveMessage", createdMessage);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const updateMessageController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const {senderid, receiverid, groupid, content, sentat, status, messageid} = req.body;
        const data = await updateMessageService(parseInt(id), senderid, receiverid, groupid, content, sentat, status, messageid);
        io.emit("receiveMessage", data);
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};

export const deleteMessageController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const data = await deleteMessageService(parseInt(id));
        io.emit("receiveMessage", data);
        res.json(data);
    } catch (error) {
        res.status(500).json({error});
    }
};



export const getLastMessagesByUserIdController = async (req: Request, res: Response) => {
    const userId = Number(req.query.userId); // ví dụ nhận từ query ?userId=10
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
  
    try {
      const messages = await getLastMessagesByUserIdService(userId); // gọi từ service hoặc model
      return res.json(messages);
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };

