const router = require('express').Router();

const { createOrder, captureOrder } = require('../../controllers/paypal.ctrl');

router.post('/order', createOrder);

router.post('/order/:orderID/capture', captureOrder);

module.exports = router;
