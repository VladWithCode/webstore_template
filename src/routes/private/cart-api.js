const {
  getCarts,
  createCart,
  getCart,
  updateCart,
  deleteCart,
} = require('../../controllers/cart.ctrl');

const router = require('express').Router();

router.post('/', createCart);

router.get('/', getCarts);

router.get('/:id', getCart);

router.put('/:id', updateCart);

router.delete('/:id', deleteCart);

module.exports = router;
