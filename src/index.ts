import express, { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import newsRoutes from "./routes/news.routes";
import inventoryRoutes from "./routes/inventory.routes";
import sequelize from "./config/database";
import path from "path";
import cors from "cors";
import { supabase } from "./config/supabase";
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/news", newsRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/inventory", inventoryRoutes);

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

// Inicialización de Supabase
async function initializeSupabase() {
  try {
    const { error } = await supabase
      .storage
      .getBucket('news-images');
    
    if (error && error.message !== 'Bucket already exists') {
      throw error;
    }
    
    console.log('Supabase Storage ready');
  } catch (error) {
    console.error('Error initializing Supabase:', error);
  }
}

initializeDatabase();
initializeSupabase();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
