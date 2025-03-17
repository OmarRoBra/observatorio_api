const express = require('express');
const {
  getNews,
  updateNews,
  deleteNews,
} = require('../controller/newsController');
const router = express.Router();

router.get('/', getNews);
router.put('/:id', updateNews);
router.delete('/:id', deleteNews);

module.exports = router;
