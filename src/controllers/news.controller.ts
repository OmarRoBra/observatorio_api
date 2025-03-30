import { Request, Response, NextFunction } from "express";
import News from "../models/news.model";
import { supabase } from "../config/supabase";
import multer, { Multer } from "multer";

// Configuración de Multer
const storage = multer.memoryStorage();
const upload: Multer = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

export const uploadMiddleware = upload.single("image");

interface UploadResult {
  error?: Error;
  publicUrl?: string;
}

const uploadToSupabase = async (
  file: Express.Multer.File
): Promise<UploadResult> => {
  try {
    const fileExt = file.originalname.split(".").pop();
    const fileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.${fileExt}`;
    const filePath = `news/${fileName}`;

    const { error } = await supabase.storage
      .from("news-images")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) return { error };

    const {
      data: { publicUrl },
    } = supabase.storage.from("news-images").getPublicUrl(filePath);

    return { publicUrl };
  } catch (error) {
    return { error: error as Error };
  }
};

const deleteFromSupabase = async (url: string): Promise<void> => {
  try {
    const path = url.split("news-images/")[1];
    if (!path) return;

    await supabase.storage.from("news-images").remove([path]);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

// Controladores actualizados con tipos correctos
export const createNews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, content, metadata, userId } = req.body;
    let imageUrl: string | null = null;

    if (req.file) {
      const { error, publicUrl } = await uploadToSupabase(req.file);
      if (error) throw error;
      imageUrl = publicUrl || null;
    }

    const news = await News.create({
      title,
      content,
      metadata,
      imageUrl,
      userId,
    });
    res.status(201).json(news);
  } catch (error) {
    next(error);
  }
};

export const getAllNews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const news = await News.findAll();
    res.json(news);
  } catch (error) {
    next(error);
  }
};

export const getNewsById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) {
      res.status(404).json({ message: "News not found" });
      return;
    }
    res.json(news);
  } catch (error) {
    next(error);
  }
};

export const updateNews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) {
      res.status(404).json({ message: "News not found" });
      return;
    }

    const { title, content, metadata } = req.body;
    let { imageUrl } = news;

    if (req.file) {
      if (imageUrl) {
        await deleteFromSupabase(imageUrl);
      }
      const { error, publicUrl } = await uploadToSupabase(req.file);
      if (error) throw error;
      imageUrl = publicUrl as string;
    }

    await news.update({ title, content, metadata, imageUrl });
    res.json(news);
  } catch (error) {
    next(error);
  }
};

export const deleteNews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) {
      res.status(404).json({ message: "News not found" });
      return;
    }

    if (news.imageUrl) {
      await deleteFromSupabase(news.imageUrl);
    }

    await news.destroy();
    res.json({ message: "News deleted successfully" });
  } catch (error) {
    next(error);
  }
};
