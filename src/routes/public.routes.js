const Router = require('express').Router;
// const businessRoutes = require('./public/business-api');
const categoryRoutes = require('./public/category-api');
const productRoutes = require('./public/product-api');
// const cartRoutes = require('./public/cart-api');
const saleRoutes = require('./public/sale-api');

const router = Router();

// router.use('/business', businessRoutes);

// router.use('/cart', cartRoutes);

router.use('/categories', categoryRoutes);

router.use('/products', productRoutes);

router.use('/sales', saleRoutes);

router.use((error, _req, res, _next) => {
  if (res.headersSent) return;
  process.env.DEBUG && console.log(error);

  if (error.name === 'MongoError') {
    return res.status(500).json({
      status: 'DB_ERROR',
      message: error.message || 'Ocurrio un error con la base de datos',
      error,
    });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      status: 'VALID_ERROR',
      message: `Hubo un error al registrar el documento en la base de datos.
        La información proporcionada no es válida`,
      error,
    });
  }

  return res.status(500).json({
    status: error.status || 'SERVER_ERROR',
    message: error.message || 'Ocurrion un error interno en el servidor.',
    error,
  });
});

module.exports = router;
