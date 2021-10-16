const { asyncHandler } = require('../functions/GeneralHelpers');
const Cart = require('../models/Cart');

const ctrl = {};

ctrl.createCart = async (req, res, next) => {
  const cart = new Cart();

  const [, saveError] = asyncHandler(cart.save());

  if (saveError) return next(err);

  return res.json({
    status: 'OK',
    cart,
  });
};

ctrl.getCarts = async (req, res, next) => {
  const [carts, findError] = await asyncHandler(Cart.find().lean());
};

ctrl.getCart = async (req, res, next) => {};

ctrl.updateCart = async (req, res, next) => {};

ctrl.deleteCart = async (req, res, next) => {};

module.exports = ctrl;
