const router = require('express').Router();

const {
  createOrder,
  captureOrder,
  getOrder,
} = require('../../controllers/paypal.ctrl');

router.post('/order', createOrder);

router.post('/order/:orderID/capture', captureOrder);

router.get('/order/:orderId', getOrder);

module.exports = router;
