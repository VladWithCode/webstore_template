const {
  getCategories,
  getCategory,
} = require('../../controllers/category.ctrl');

const router = require('express').Router();

router.get('/', getCategories);

router.get('/:id', getCategory);

module.exports = router;
