import { Request, Response } from 'express';
import News from '../models/news.model';
import { createClient } from '@supabase/supabase-js';

// Configura Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const createNews = async (req: Request, res: Response): Promise<void> => {
  const { title, content, metadata, userId } = req.body;
  
  try {
    let imageUrl = null;
    
    // Subir imagen a Supabase si existe
    if (req.file) {
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `news/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('news-images') // Nombre de tu bucket en Supabase
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
        });
      
      if (error) throw error;
      
      // Obtener URL pública de la imagen
      const { data: { publicUrl } } = supabase.storage
        .from('news-images')
        .getPublicUrl(filePath);
      
      imageUrl = publicUrl;
    }

    const news = await News.create({ title, content, metadata, imageUrl, userId });
    res.status(201).json(news);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error creating news', error });
  }
};

export const updateNews = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, content, metadata } = req.body;

  try {
    const news = await News.findByPk(id);
    if (!news) {
      res.status(404).json({ message: 'News not found' });
      return;
    }

    // Subir nueva imagen a Supabase si existe
    if (req.file) {
      // Eliminar imagen anterior si existe
      if (news.imageUrl) {
        const oldFilePath = news.imageUrl.split('/').pop();
        await supabase.storage
          .from('news-images')
          .remove([`news/${oldFilePath}`]);
      }

      // Subir nueva imagen
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `news/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('news-images')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
        });
      
      if (error) throw error;
      
      // Obtener URL pública de la nueva imagen
      const { data: { publicUrl } } = supabase.storage
        .from('news-images')
        .getPublicUrl(filePath);
      
      news.imageUrl = publicUrl;
    }

    news.title = title || news.title;
    news.content = content || news.content;
    news.metadata = metadata || news.metadata;
    await news.save();

    res.json(news);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error updating news', error });
  }
};

// Los demás métodos (getAllNews, getNewsById, deleteNews) permanecen igual
export const getAllNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const news = await News.findAll();
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error });
  }
};

export const getNewsById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const news = await News.findByPk(id);
    if (!news) {
      res.status(404).json({ message: 'News not found' });
      return;
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error });
  }
};

export const deleteNews = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const news = await News.findByPk(id);
    if (!news) {
      res.status(404).json({ message: 'News not found' });
      return;
    }

    // Eliminar imagen de Supabase si existe
    if (news.imageUrl) {
      const filePath = news.imageUrl.split('/').pop();
      await supabase.storage
        .from('news-images')
        .remove([`news/${filePath}`]);
    }

    await news.destroy();
    res.json({ message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting news', error });
  }
};