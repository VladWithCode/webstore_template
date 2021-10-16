const fs = require('fs/promises');
const path = require('path');
const { publicDirPath } = require('../config/globals');
const slugifyString = require('../functions/slugifyString');
const Product = require('../models/Product');

const ctrl = {};

ctrl.createProduct = async (req, res, next) => {
  const { productData } = req.body;
  const imgs = req.files?.imgs;

  const product = new Product(productData);

  const slugifiedName = slugifyString(product.name);

  product.absolutePath = path.join(publicDirPath, '/products', slugifiedName);
  product.staticPath = `/static/products/${slugifiedName}`;

  const { options, extras } = productData;

  product.options = options?.map(option => {
    return { ...option, _id: undefined, ogOption: option._id };
  });

  product.extras = extras?.map(extra => {
    return { ...extra, _id: undefined, ogExtra: extra._id };
  });

  try {
    await fs.mkdir(product.absolutePath, { recursive: true });
  } catch (err) {
    return next(err);
  }

  if (imgs && imgs.length > 0) {
    const writeImagesPromises = [];

    imgs.forEach(img => {
      const staticPath = `${product.staticPath}/${img.name}`;

      if (product.imgs.includes(staticPath)) return;

      product.imgs.push(staticPath);

      writeImagesPromises.push(
        fs.writeFile(path.join(product.absolutePath, img.name), img.data)
      );
    });

    try {
      await Promise.all(writeImagesPromises);
    } catch (err) {
      return next(err);
    }
  }

  try {
    await product.save();
  } catch (err) {
    return next(err);
  }

  return res.json({
    status: 'OK',
    product,
  });
};

ctrl.getProducts = async (req, res) => {
  const { ids, names, ctgs } = req.query;

  const queryFilter = {};

  if (ids) {
    queryFilter._id = ids.split(',');
  }

  if (names) {
    queryFilter.name = names.split(',');
  }

  if (ctgs) {
    queryFilter.ctg = ctgs.split(',');
  }

  const products = await Product.find(queryFilter).lean();

  if ((ids || names || ctgs) && (!products || products.length === 0)) {
    return res.json({
      status: 'NOT_FOUND',
      message: 'No se encontraron productos',
    });
  }

  return res.json({
    status: 'OK',
    products,
  });
};

ctrl.getProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id).lean();

  if (!product) {
    return res.json({
      status: 'NOT_FOUND',
      message: `No se encontró producto con id: ${id}`,
    });
  }

  return res.json({
    status: 'OK',
    product,
  });
};

ctrl.updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { productData } = req.body;
  const imgs = req.files?.imgs;

  const product = await Product.findById(id);

  if (!product) {
    return res.json({
      status: 'NOT_FOUND',
      message: `No se encontró producto con id: ${id}`,
    });
  }

  if (productData) {
    product.set(productData);
  }

  // Remove images from product and disk
  if (imgs && imgs.length < product.imgs.length) {
    const deleteImagesPromises = [];

    product.imgs = product.imgs.filter(img => {
      const keepImg = imgs.includes(img);

      if (!keepImg)
        deleteImagesPromises.push(
          fs.rm(path.join(product.absolutePath, path.basename(img)), {
            recursive: true,
            force: true,
          })
        );

      return keepImg;
    });

    try {
      await Promise.all(deleteImagesPromises);
    } catch (err) {
      return next(err);
    }
  }

  // Add new images to the product and write them to disk
  if (imgs && imgs.length > 0) {
    const writeImagesPromises = [];

    imgs.forEach(img => {
      product.imgs.push(`${product.staticPath}/${img.name}`);

      writeImagesPromises.push(
        fs.writeFile(path.join(product.absolutePath, img.name), img.data)
      );
    });

    try {
      await Promise.all(writeImagesPromises);
    } catch (err) {
      return next(err);
    }
  }

  try {
    await product.save();
  } catch (err) {
    return next(err);
  }

  return res.json({
    status: 'OK',
    product,
  });
};

ctrl.deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return res.json({
      status: 'NOT_FOUND',
      message: `No se encontró producto con id: ${id}`,
    });
  }

  try {
    await product.remove();

    await fs.rm(product.absolutePath, { recursive: true, force: true });
  } catch (err) {
    return next(err);
  }

  return res.json({
    status: 'OK',
    message: `Se eliminó el producto con id: ${id}`,
  });
};

module.exports = ctrl;
