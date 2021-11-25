const stripe = require('../config/stripe');
const ctrl = {};

const { asyncHandler, safeRound } = require('../functions/GeneralHelpers');
const Customer = require('../models/Customer');

const Product = require('../models/Product');
const Sale = require('../models/Sale');

ctrl.createPaymentIntent = (req, res, next) => {
  const { customerId } = req.body;

  let customer;

  if (customerId) {
    const [c, findCustomerError] = await asyncHandler(
      Customer.findById(customerId)
    );

    if (findCustomerError) return next(findCustomerError);

    customer = c;
  }

  const cart = customer.cart || req.body.cart;

  let totalAmount;

  if (!customer) {
    const [products, findProductsError] = await asyncHandler(
      Product.find({ _id: cart.items.map(i => i.product) })
    );

    if (findProductsError) return next(findProductsError);

    totalAmount = products.reduce((acc, product) => {
      const qty = cart.items.find(i => i.product === String(product._id)).qty;

      return acc + safeRound(product.price * qty);
    }, 0);

    if (cart.shipment) totalAmount += cart.shipment;
  } else {
    totalAmount = cart.total;
  }

  const [paymentIntent, createPaymentIntentError] = await asyncHandler(
    stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    })
  );

  if (createPaymentIntentError) return next(createPaymentIntentError);

  return res.json({
    status: 'OK',
    clientSecret: paymentIntent.client_secret,
  });
};

module.exports = ctrl;
