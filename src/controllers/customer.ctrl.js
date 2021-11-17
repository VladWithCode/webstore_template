const { updateCartTotals } = require('../functions/CustomerHelpers');
const { asyncHandler, safeRound } = require('../functions/GeneralHelpers');
const Customer = require('../models/Customer');
const Product = require('../models/Product');

const ctrl = {};

// CRUD
ctrl.getCustomer = async (req, res, next) => {
  const { id } = req.params;

  const [customer, findError] = await asyncHandler(
    Customer.findById(id).lean()
  );

  if (findError) return next(findError);

  if (!customer)
    return res.json({
      status: 'NOT_FOUND',
      message: `No se encontró usuario para el id: ${id}`,
    });

  return res.json({
    status: 'OK',
    customer,
  });
};

ctrl.getSessionCustomer = async (req, res, next) => {
  return res.json({
    status: 'OK',
    customer: req.user,
  });
};

ctrl.updateCustomer = async (req, res, next) => {
  const { id } = req.params;
  const customerData = req.body;

  const [customer, findError] = await asyncHandler(Customer.findById(id));

  if (findError) return next(findError);

  if (!customer)
    return res.json({
      status: 'NOT_FOUND',
      message: `No se encontró cliente con id: ${id}`,
    });

  customer.set(customerData);

  const [, saveError] = await customer.save();

  if (saveError) return next(saveError);

  return res.json({
    status: 'OK',
    message: `Cliente con id: ${id} actualizado con exito`,
    customer,
  });
};

ctrl.deleteCustomer = async (req, res, next) => {
  const { id } = req.params;

  const [customer, findError] = await asyncHandler(Customer.findById(id));

  if (findError) return next(findError);

  if (!customer)
    return res.json({
      status: 'NOT_FOUND',
      message: `No se encontró cliente con id: ${id}`,
    });

  const [, deleteError] = await asyncHandler(customer.delete());

  if (deleteError) return next(deleteError);

  return res.json({
    status: 'OK',
    message: 'Cliente eliminado con exito',
  });
};

ctrl.addToCart = async (req, res, next) => {
  const { id } = req.params;
  const productData = req.body;

  const [customer, findCustomerError] = await asyncHandler(
    Customer.findById(id)
  );

  if (findCustomerError) return next(findCustomerError);

  if (!customer)
    return res.json({
      status: 'NOT_FOUND',
      message: `No se encontró cliente con id: ${id}`,
    });

  const [product, findProductError] = await asyncHandler(
    Product.findById(productData._id)
  );

  if (findProductError) return next(findProductError);

  if (!product)
    return res.json({
      status: 'NOT_FOUND',
      message: `No se encontró producto con id: ${productData._ids}`,
    });

  customer.cart.isEmpty = false;

  const existingProductIndex = customer.cart.items.findIndex(
    i => String(i.product) === String(product._id)
  );

  if (existingProductIndex < 0) {
    customer.cart.items.push({
      product: String(product._id),
      name: product.name,
      size: productData.size,
      qty: productData.qty,
      price: product.price,
      total: safeRound(product.price * productData.qty),
    });
  } else {
    const item = customer.cart.items[existingProductIndex];
    item.qty += productData.qty;
    item.total = safeRound(item.qty * item.price);
  }

  updateCartTotals(customer.cart);

  const [, saveError] = await asyncHandler(customer.save());

  return res.json({
    status: 'OK',
    cart: customer.cart,
  });
};

module.exports = ctrl;
