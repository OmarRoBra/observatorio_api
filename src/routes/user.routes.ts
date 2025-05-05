import express from 'express';
import { getUser, updateUser,deleteUser} from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/me', authMiddleware, getUser);
/* router.put('/me', authMiddleware, updateUser);
 */
router.get('/me:id',deleteUser)
export default router;