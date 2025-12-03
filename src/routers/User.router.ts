import { createUserController, deleteUserController, getCurrentUser, getUserByAccountController, getUsersController, loginController, logoutController, updatePasswordController, updateUserController, uploadAvatar } from "../controllers/User.controller";
import { Router } from 'express';
import { authMiddleware } from "../middlewares/auth.middlewares";

const router = Router();

// Route không cần xác thực
router.post('/login', loginController);
router.post('/register', createUserController);

// Áp dụng middleware auth cho tất cả route dưới đây
router.use(authMiddleware);

// Route cần xác thực
router.get('/', getUsersController);
router.get('/me', getCurrentUser);
router.put('/update-avatar', uploadAvatar);
router.patch('/update/:email', updateUserController);
router.delete('/delete/:email', deleteUserController);
router.post('/logout', logoutController);
router.put('/update-password/:email', updatePasswordController);

export default router;