import { Router } from 'express';
import { getFriendShipByIdController, createFriendShipController, updateFriendShipController, deleteFriendShipController, getFriendShipsController } from '../controllers/FriendShip.controller';
import validate from '../middlewares/validate';
import friendshipSchema from '../validations/friendshipSchema';

const router = Router();

router.get('/', getFriendShipsController);
router.get('/:id', getFriendShipByIdController);
router.post('/', validate(friendshipSchema), createFriendShipController);
router.put('/:id', validate(friendshipSchema), updateFriendShipController);
router.delete('/:id', deleteFriendShipController);

export default router;