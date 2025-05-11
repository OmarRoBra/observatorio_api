import express, { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import newsRoutes from "./routes/news.routes";
import inventoryRoutes from "./routes/inventory.routes";
import sequelize from "./config/database";
import excelRoutes from './routes/excel.routes';

import path from "path";
import cors from "cors";
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: "https://observatorio-colima-6yfm-git-main-brauliorodriguez23s-projects.vercel.app/" // Reemplaza con tu URL
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/news", newsRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/inventory", inventoryRoutes);
// En tu index.ts (backend)
 // Prefijo /api/excel
// Asegúrate de que la ruta esté montada correctamente
app.use('/excel', excelRoutes); // ✔️ Debe coincidir con la URL del frontend

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

async function initializeDatabase() {
  try {
    await sequelize.authenticate(); // Verificar la conexión
    await sequelize.sync(); // Sincronizar modelos con la base de datos
    console.log("Base de datos sincronizada correctamente.");
  } catch (error) {
    console.error("Error al sincronizar la base de datos:", error);
  }
}

initializeDatabase();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
