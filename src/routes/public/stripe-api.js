const router = require('express').Router();

const {
  createPaymentIntent,
  saveSale,
} = require('../../controllers/stripe.ctrl');

router.post('/payment-intents', createPaymentIntent);

router.post('/save-sale', saveSale);

module.exports = router;
