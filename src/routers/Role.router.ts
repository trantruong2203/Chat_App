import { Router } from "express";
import { getAllRolesController, getRoleByIdController, createRoleController, updateRoleController, deleteRoleController } from "../controllers/Role.controller";

const router = Router();

router.get('/', getAllRolesController);
router.get('/:id', getRoleByIdController);
router.post('/', createRoleController);
router.put('/:id', updateRoleController);
router.delete('/:id', deleteRoleController);

export default router;