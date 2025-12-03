import { Router } from "express";
import { createMessageImgController, deleteMessageImgController, getMessageImgByIdController, getMessageImgsController, updateMessageImgController } from "../controllers/MessageImg.controller";


const router = Router();

router.get('/', getMessageImgsController);
router.get('/:id', getMessageImgByIdController);
router.post('/', createMessageImgController);
router.put('/:id', updateMessageImgController);
router.delete('/:id', deleteMessageImgController);

export default router;