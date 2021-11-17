const paypal = require('@paypal/checkout-server-sdk');

const Sale = require('../models/Sale');
const Product = require('../models/Product');

const paypalClient = require('../config/paypal');
const { asyncHandler, safeRound } = require('../functions/GeneralHelpers');

ctrl = {};

ctrl.createOrder = async (req, res, next) => {
  const saleData = req.body;

  // Create Sale
  const sale = new Sale(saleData);

  if (!sale.items || sale.items.length < 1)
    return res.status(400).json({
      status: 'NO_EMPTY_ORDER',
      message: 'No se permiten ordenes vacias',
    });

  if (!sale.payment) {
    sale.payment = {
      method: 'paypal',
    };
  }

  const productIds = saleData.items?.map(i => i.product);

  const [products, findProductsError] = await asyncHandler(
    Product.find({ _id: productIds })
  );

  if (findProductsError) return next(findProductsError);

  for (const product of products) {
    const index = sale.items.findIndex(
      i => String(i.product) === String(product._id)
    );
    const item = sale.items[index];

    if (!item) continue;

    item.name = product.name;
    item.price = product.price;
    item.total = safeRound(item.price * item.qty);

    sale.payment.subtotal += item.total;
  }

  sale.payment.total = safeRound(sale.payment.subtotal + sale.payment.shipment);
  const createOrderRequest = new paypal.orders.OrdersCreateRequest();
  createOrderRequest.headers['prefer'] = 'return=representation';

  createOrderRequest.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: `${sale.payment.total.toFixed(2)}`,
        },
      },
    ],
  });

  const [order, createOrderError] = await asyncHandler(
    paypalClient.execute(createOrderRequest)
  );

  if (createOrderError) return next(createOrderError);

  sale.payment._id = order.result.id;

  const [, saveError] = await asyncHandler(sale.save());

  if (saveError) return next(saveError);

  return res.json({
    status: 'OK',
    order: order.result,
    sale,
  });
};

ctrl.captureOrder = async (req, res, next) => {
  const { orderID } = req.params;

  const sale = await Sale.findOne({ 'payment._id': orderID });

  if (!sale)
    return res.json({
      status: 'NOT_FOUND',
      message: `No se encontró una venta para el id de pago: ${orderID}`,
    });

  const captureOrderRequest = new paypal.orders.OrdersCaptureRequest(orderID);
  captureOrderRequest.requestBody({});

  const [capture, captureOrderError] = await asyncHandler(
    paypalClient.execute(captureOrderRequest)
  );

  if (captureOrderError) return next(captureOrderError);

  sale.payment.paid = true;
  sale.payment.paidAt = new Date();

  const paymentCapture = capture.result.purchase_units[0].payments.captures[0];

  sale.payment.paypalFee =
    +paymentCapture.seller_receivable_breakdown.paypal_fee.value;
  sale.payment.earnings =
    +paymentCapture.seller_receivable_breakdown.net_amount.value;

  const [, saveError] = await asyncHandler(sale.save());

  if (saveError) return next(saveError);

  console.log(capture.result);

  return res.json({
    status: 'OK',
    sale,
    order: capture.result,
  });
};

ctrl.getOrder = async (req, res, next) => {
  const { orderID } = req.params;

  const [sale, findError] = await asyncHandler(
    Sale.findOne({
      'payment._id': orderID,
    }).lean()
  );

  if (findError) return next(findError);

  if (!sale)
    return res.json({
      status: 'NOT_FOUND',
      message: `No se encontró una venta para el id de pago: ${orderID}`,
    });

  const [order, getOrderError] = await asyncHandler(
    paypalClient.execute(new paypal.orders.OrdersGetRequest(orderID))
  );

  if (getOrderError) return next(getOrderError);

  if (!order)
    return res.json({
      status: 'NOT_FOUND',
      message: `No se encontró una orden para el id: ${orderID}`,
    });

  return res.json({
    status: 'OK',
    sale,
    order,
  });
};

module.exports = ctrl;
