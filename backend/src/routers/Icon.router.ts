import { Router } from 'express';
import { getIcons, getIconByIdController, createIconController, updateIconController, deleteIconController } from '../controllers/Icon.controller';

const router = Router();

router.get('/', getIcons);
router.get('/:id', getIconByIdController);
router.post('/', createIconController);
router.put('/:id', updateIconController);
router.delete('/:id', deleteIconController);

export default router;
