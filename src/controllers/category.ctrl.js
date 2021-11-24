const Category = require('../models/Category');

const { asyncHandler } = require('../functions/GeneralHelpers');
const ctrl = {};

ctrl.createCategory = async (req, res, next) => {
  const categoryData = req.body;

  const category = new Category(categoryData);

  const [, saveError] = await asyncHandler(category.save());
  if (saveError) return next(saveError);

  return res.json({
    status: 'OK',
    category,
  });
};

ctrl.getCategories = async (req, res, next) => {
  const [categories, findError] = await asyncHandler(Category.find().lean());

  if (findError) return next(err);

  return res.json({
    status: 'OK',
    categories,
  });
};

ctrl.getCategory = async (req, res, next) => {
  const { id } = req.params;

  const [category, findError] = await asyncHandler(Category.findById(id));

  if (findError) return next(findError);

  if (!category) {
    return res.json({
      status: 'NOT_FOUND',
      message: `No se encontró categoria con id: ${id}`,
    });
  }

  return res.json({
    status: 'OK',
    category,
  });
};

ctrl.updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const categoryData = req.body;

  const [category, findError] = await asyncHandler(Category.findById(id));

  if (findError) return next(findError);

  if (!category) {
    return res.json({
      status: 'NOT_FOUND',
      message: `No se encontró categoria con id: ${id}`,
    });
  }

  category.set(categoryData);

  const [, saveError] = await category.save();

  if (saveError) return next(saveError);

  return res.json({
    status: 'OK',
    category,
  });
};

ctrl.deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  const [category, findError] = await asyncHandler(Category.findById(id));

  if (findError) return next(findError);

  if (!category) {
    return res.json({
      status: 'NOT_FOUND',
      message: `No se encontró categoria con id: ${id}`,
    });
  }

  const [, saveError] = await category.save();

  if (saveError) return next(saveError);

  return res.json({
    status: 'OK',
    message: `Se eliminó correctamente la categoria con id: ${id}`,
  });
};

module.exports = ctrl;
