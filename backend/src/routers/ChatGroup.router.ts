import { Router } from "express";
import { getAllChatGroupsController, getChatGroupByIdController, createChatGroupController, updateChatGroupController, deleteChatGroupController } from "../controllers/ChatGroup.controller";

const router = Router();

router.get('/', getAllChatGroupsController);
router.get('/:id', getChatGroupByIdController);
router.post('/', createChatGroupController);
router.put('/:id', updateChatGroupController);
router.delete('/:id', deleteChatGroupController);

export default router;