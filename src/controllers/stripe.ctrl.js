const stripe = require('../config/stripe');
const {
  findCustomer,
  calculateCartTotals,
} = require('../functions/CustomerHelpers');
const ctrl = {};

const { asyncHandler, safeRound } = require('../functions/GeneralHelpers');

const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Sale = require('../models/Sale');

ctrl.createPaymentIntent = async (req, res, next) => {
  const { customerId } = req.body;

  const customer = await findCustomer(customerId);

  const cart = customer?.cart || req.body.cart;

  const [totalAmount, calculateTotalsError] = await asyncHandler(
    calculateCartTotals(cart)
  );

  if (calculateTotalsError) return next(calculateTotalsError);

  const [paymentIntent, createPaymentIntentError] = await asyncHandler(
    stripe.paymentIntents.create({
      amount: totalAmount * 100,
      currency: 'mxn',
      /* automatic_payment_methods: {
        enabled: true,
      }, */
    })
  );

  if (createPaymentIntentError) return next(createPaymentIntentError);

  return res.json({
    status: 'OK',
    clientSecret: paymentIntent.client_secret,
  });
};

ctrl.saveSale = async (req, res, next) => {
  const { intentId, cart, customerData } = req.body;

  const [paymentIntent, fetchPaymentIntentError] = await asyncHandler(
    stripe.paymentIntents.retrieve(intentId)
  );

  if (fetchPaymentIntentError) return next(fetchPaymentIntentError);

  const [products, fetchProductsError] = await asyncHandler(
    Product.find({
      _id: cart.map(i => i.product),
    })
  );

  if (fetchProductsError) return next(fetchProductsError);

  const productPrices = {};

  let totalAmount = products.reduce((acc, product) => {
    const id = String(product._id);
    const item = cart.find(i => i.product === id);

    if (!item) return;

    productPrices[id] = [
      safeRound(product.price * (item.qty || 1)),
      product.price,
    ];

    return acc + productPrices[id][0];
  }, 0);

  const sale = new Sale({
    customer: {
      id: customerData.id,
      name: customerData.name,
      phone: customerData.phone,
      email: customerData.email,
    },
    address: {
      street: customerData.street,
      col: customerData.col,
      zip: customerData.zip,
      extNumber: customerData.extNumber,
      intNumber: customerData.intNumber,
    },
    items: cart.map(i => {
      return {
        product: i._id,
        name: i.name,
        size: i.size,
        qty: i.qty,
        price: productPrices[i.product][1] * 100,
        total: productPrices[i.product][0] * 100,
      };
    }),
    payment: {
      _id: paymentIntent.id,
      method: 'tarjeta',
      paid: paymentIntent.status === 'succeeded',
      paidAt: paymentIntent.created,
      subtotal: totalAmount,
      shipment: customerData.shipment,
      tax: customerData.tax,
      total:
        safeRound(
          totalAmount + (customerData.shipment || 0) + (customerData.tax || 0)
        ) * 100,
    },
  });

  const [, saveError] = await asyncHandler(sale.save());

  if (saveError) {
    const [refund, createRefundError] = await asyncHandler(
      stripe.refunds.create({
        charge: paymentIntent.id,
      })
    );

    if (createRefundError)
      return res.status(500).json({
        status: 'REFUND_ERROR',
        message:
          'Contacte a soporte para continuar con el proceso de devolucion',
      });

    console.log('refund id: ', refund);

    return next(saveError);
  }

  return res.json({
    status: 'OK',
    sale: sale,
  });
};

module.exports = ctrl;
