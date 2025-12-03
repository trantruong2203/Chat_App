import { Router } from "express";
import { getGroupMemberController, getGroupMemberByIdController, createGroupMemberController, updateGroupMemberController, deleteGroupMemberController } from "../controllers/GroupMember.controller";

const router = Router();

router.get('/', getGroupMemberController);
router.get('/:id', getGroupMemberByIdController);
router.post('/', createGroupMemberController);
router.put('/:id', updateGroupMemberController);
router.delete('/:id', deleteGroupMemberController);

export default router;