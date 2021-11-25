const router = require('express').Router();

const { createPaymentIntent } = require('../../controllers/stripe.ctrl');

router.post('/payment-intent', createPaymentIntent);

module.exports = router;
