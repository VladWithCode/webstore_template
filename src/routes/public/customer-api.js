const {
  getCustomer,
  getSessionCustomer,
  updateCustomer,
  deleteCustomer,
  addToCart,
} = require('../../controllers/customer.ctrl');

const router = require('express').Router();

router.get('/logged', getSessionCustomer);

router.get('/:id', getCustomer);

router.put('/:id', updateCustomer);

router.delete('/:id', deleteCustomer);

router.post('/:id/cart/add', addToCart);

router.delete('/:id/cart/remove');

module.exports = router;
