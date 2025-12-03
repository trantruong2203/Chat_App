import { Router } from "express";
import { getAllMessagesController, getMessageByIdController, createMessageController, updateMessageController, deleteMessageController, getLastMessagesByUserIdController } from "../controllers/Message.controller";

const router = Router();

router.get('/last-messages', getLastMessagesByUserIdController);
router.get('/', getAllMessagesController);
router.get('/:id', getMessageByIdController);
router.post('/', createMessageController);
router.put('/:id', updateMessageController);
router.delete('/:id', deleteMessageController);


export default router;