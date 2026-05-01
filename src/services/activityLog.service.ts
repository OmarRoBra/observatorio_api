import ActivityLog from '../models/ActivityLog.model';
import { CreationAttributes } from 'sequelize';

export const createActivityLog = async (data: CreationAttributes<ActivityLog>) => {
   try {
       await ActivityLog.create(data);
   } catch (error) {
       console.error("Error al registrar la actividad:", error);
   }
}