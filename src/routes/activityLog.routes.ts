import { Router } from 'express';
import { createActivityLog } from '../services/activityLog.service';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware';
import { ActivityLog } from '../models';
const router = Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const logs = await ActivityLog.findAll({
            order: ["createdAt", "DESC"],
            limit: 200,
        });
        res.json(logs);
    } catch (error) {
        console.log(error)
        res.status(500).json({ mesagge: "error al obtener los registros" })
    }

})
export default router;