import { Request, Response } from 'express';
import News from '../models/news.model';

export const createNews = async (req: Request, res: Response): Promise<void> => {
  const { title, content, metadata, userId } = req.body;
  const imageUrl = req.file ? `/uploads/images/${req.file.filename}` : null;

  try {
    const news = await News.create({ title, content, metadata, imageUrl, userId });
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error creating news', error });
  }
};

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

export const updateNews = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, content, metadata } = req.body;
  const imageUrl = req.file ? `/uploads/images/${req.file.filename}` : null;

  try {
    const news = await News.findByPk(id);
    if (!news) {
      res.status(404).json({ message: 'News not found' });
      return;
    }

    news.title = title || news.title;
    news.content = content || news.content;
    news.metadata = metadata || news.metadata;
    news.imageUrl = imageUrl || news.imageUrl;
    await news.save();

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error updating news', error });
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

    await news.destroy();
    res.json({ message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting news', error });
  }
};