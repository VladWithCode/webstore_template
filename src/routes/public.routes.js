const Router = require('express').Router;
const businessRoutes = require('./public/business-api');
const categoryRoutes = require('./public/category-api');
const productRoutes = require('./public/product-api');
const cartRoutes = require('./public/cart-api');
const saleRoutes = require('./public/sale-api');

const router = Router();

router.use('/business', businessRoutes);

router.use('/cart', cartRoutes);

router.use('/categories', categoryRoutes);

router.use('/product', productRoutes);

router.use('/sale', saleRoutes);

module.exports = router;
