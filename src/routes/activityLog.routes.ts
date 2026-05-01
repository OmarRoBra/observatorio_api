import { Router } from 'express';
import { createActivityLog } from '../services/activityLog.service';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware';
import ActivityLog from '../models/ActivityLog.model';
const router = Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const logs = await ActivityLog.findAll({
            order: ["createdAt", "DESC"],
            limit: 200,
        });
        res.json(logs);
    } catch (error) {
        console.error("ERROR AL OBTENER LOGS:", error);
        res.status(500).json({ 
            message: "error al obtener los registros", 
            error: error instanceof Error ? error.message : String(error) 
        });
    }

})
export default router;