const conekta = require('../config/conekta');
const { asyncHandler, safeRound } = require('../functions/GeneralHelpers');

const Product = require('../models/Product');
const Sale = require('../models/Sale');

// const asyncOp = require('../functions/asyncOperation');

const ctrl = {};

ctrl.initSale = async (req, res) => {
  const sale = new Sale();

  return res.json({
    status: 'OK',
    sale,
  });
};

ctrl.registerSale = async (req, res, next) => {
  const saleData = req.body;

  const sale = new Sale(saleData);

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

  const lineItems = [];

  sale.items.forEach(i => {
    lineItems.push({
      name: i.name,
      unit_price: i.price * 100,
      quantity: i.qty,
      sku: String(i._id),
    });
  });

  const [orderResponse, createOrderError] = await asyncHandler(
    conekta.Order.create({
      amount: sale.payment.total * 100,
      currency: 'MXN',
      customer_info: {
        name: sale.customer.name,
        phone: sale.customer.phoneNum || '+526188009090',
        email: sale.customer.email || 'zickgamemaster@gmail.com',
      },
      line_items: lineItems,
      charges: [
        {
          payment_method: {
            type: 'card',
            token_id: sale.payment.token,
          },
        },
      ],
    })
  );

  if (createOrderError) return next(createOrderError);

  const order = orderResponse.toObject();

  sale._id = order.id;
  sale.payment.paid = order.payment_status === 'paid';
  sale.payment.paidAt = order.created_at;

  const [, saveError] = await asyncHandler(sale.save());

  if (saveError) return next(saveError);

  return res.json({
    status: 'OK',
    sale,
  });
};

ctrl.getSales = async (req, res, next) => {
  const {} = req.query;

  const [sales, findError] = await asyncHandler(Sale.find().lean());

  if (findError) return next(findError);

  return res.json({
    status: 'OK',
    sales,
  });
};

ctrl.getSale = async (req, res, next) => {
  const { id } = req.params;

  const [sale, findError] = await asyncHandler(Sale.findById(id).lean());

  if (findError) return next(findError);

  if (!sale) {
    return res.json({
      status: 'NOT_FOUND',
      message: `No se encontró venta con id: ${id}`,
    });
  }

  return res.json({
    status: 'OK',
    sale,
  });
};

ctrl.updateSale = async (req, res, next) => {
  const { id } = req.params;
  const { saleData } = req.body;

  const [sale, findError] = await asyncHandler(Sale.findById(id));

  if (findError) return next(findError);

  if (!sale) {
    return res.json({
      status: 'NOT_FOUND',
      message: `No existe venta con id ${id}`,
    });
  }
};

ctrl.deleteSale = async (req, res, next) => {
  const { id } = req.params;

  const [sale, findError] = await asyncHandler(Sale.findById(id));

  if (findError) return next(findError);

  if (!sale) {
    return res.json({
      status: 'NOT_FOUND',
      message: `No existe venta con id ${id}`,
    });
  }
};

ctrl.cancelSale = async (req, res, next) => {
  const { id } = req.params;

  const [sale, findError] = await asyncHandler(Sale.findById(id));

  if (findError) return next(findError);

  if (!sale) {
    return res.json({
      status: 'NOT_FOUND',
      message: `No existe venta con id ${id}`,
    });
  }
};

module.exports = ctrl;
