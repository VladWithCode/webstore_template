const {
  getCustomer,
  getSessionCustomer,
} = require('../../controllers/customer.ctrl');

const router = require('express').Router();

router.get('/logged', getSessionCustomer);

router.get('/:id', getCustomer);

module.exports = router;
