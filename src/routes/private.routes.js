const Router = require('express').Router;
const businessRoutes = require('./private/business-api');
const categoryRoutes = require('./private/category-api');
const productRoutes = require('./private/product-api');
const cartRoutes = require('./private/cart-api');
const saleRoutes = require('./private/sale-api');

const router = Router();

router.use('/business', businessRoutes);

router.use('/cart', cartRoutes);

router.use('/categories', categoryRoutes);

router.use('/product', productRoutes);

router.use('/sale', saleRoutes);

module.exports = router;
