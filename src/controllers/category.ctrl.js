const path = require('path');

const Category = require('../models/Category');

const { publicDirPath } = require('../config/globals');
const {
  createDirectory,
  writeFile,
  deleteFileOrDirectory,
} = require('../functions/FileHelpers');
const { asyncHandler } = require('../functions/GeneralHelpers');
const ctrl = {};

ctrl.createCategory = async (req, res, next) => {
  const { categoryData } = req.body;
  const img = req.files?.img[0];

  const category = new Category(categoryData);

  category.absolutePath = path.join(
    publicDirPath,
    '/categories',
    category.slug
  );
  category.staticPath = `/static/categories/${category.slug}`;

  const [, createDirError] = await asyncHandler(
    createDirectory(category.absolutePath, true)
  );

  if (createDirError) return next(err);

  if (img) {
    const [, writeFileError] = await asyncHandler(
      writeFile(
        img.data,
        path.join(category.absolutePath, 'main' + path.extname(img.name))
      )
    );

    if (writeFileError) return next(err);
  }

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
  const { categoryData } = req.body;
  const img = req.files?.img[0];

  const [category, findError] = await asyncHandler(Category.findById(id));

  if (findError) return next(findError);

  if (!category) {
    return res.json({
      status: 'NOT_FOUND',
      message: `No se encontró categoria con id: ${id}`,
    });
  }

  if (categoryData) {
    category.set(categoryData);
  }

  if (img) {
    const [, writeFileError] = await writeFile(
      img.data,
      path.join(category.absolutePath, 'main' + path.extname(img.name))
    );

    if (writeFileError) return next(err);
  }

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

  const [, deleteDirError] = await deleteFileOrDirectory(
    category.absolutePath,
    true
  );

  if (deleteDirError) console.log(deleteDirError);

  const [, saveError] = await category.save();

  if (saveError) return next(saveError);

  return res.json({
    status: 'OK',
    message: `Se eliminó correctamente la categoria con id: ${id}`,
  });
};

module.exports = ctrl;
