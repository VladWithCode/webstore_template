const { safeRound } = require('./GeneralHelpers');

const CustomerHelpers = {};

CustomerHelpers.updateCartTotals = cart => {
  const subtotal = cart.items.reduce((acc, i) => {
    return acc + i.total;
  }, 0);
  const total = safeRound(subtotal + cart.tax + cart.shipment);

  cart.subtotal = safeRound(subtotal);
  cart.total = total;
};

module.exports = CustomerHelpers;
