const { isValidObjectId } = require('mongoose');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const { safeRound, asyncHandler } = require('./GeneralHelpers');

const CustomerHelpers = {};

CustomerHelpers.updateCartTotals = cart => {
  const subtotal = cart.items.reduce((acc, i) => {
    return acc + i.total;
  }, 0);
  const total = safeRound(subtotal + cart.tax + cart.shipment);

  cart.subtotal = safeRound(subtotal);
  cart.total = total;
};

CustomerHelpers.findCustomer = async id => {
  if (!isValidObjectId(id)) return false;

  const [customer, findCustomerError] = await asyncHandler(
    Customer.findById(id)
  );

  if (!findCustomerError || customer) return false;

  return customer;
};

CustomerHelpers.calculateCartTotals = async cart => {
  const items = Array.isArray(cart) ? cart : cart.items;

  const products = await Product.find({ _id: items.map(i => i.product) });

  let totalAmount = products.reduce((acc, product) => {
    const qty = items.find(i => i.product === String(product._id)).qty;

    return acc + safeRound(product.price * qty);
  }, 0);

  if (cart.shipment > 0) totalAmount += cart.shipment;

  return totalAmount;
};

module.exports = CustomerHelpers;
