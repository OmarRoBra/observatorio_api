const News = require('../models/News');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

exports.upload = multer({ storage: storage });

exports.createNews = async (req, res) => {
  const news = new News({
    title: req.body.title,
    description: req.body.description,
    image: req.file.path,
  });

  try {
    await news.save();
    res.status(201).send(news);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getNews = async (req, res) => {
  try {
    const news = await News.find();
    res.send(news);
  } catch (error) {
    res.status(500).send();
  }
};

exports.updateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(news);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteNews = async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send();
  }
};
