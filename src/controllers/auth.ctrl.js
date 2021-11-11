const { asyncHandler } = require('../functions/GeneralHelpers');
const Customer = require('../models/Customer');

const ctrl = {};

ctrl.singup = async (req, res, next) => {
  const { name, lastname, email, pass } = req.body;

  const [customerExists, existsCheckError] = await asyncHandler(
    Customer.exists({ email })
  );

  if (existsCheckError) return next(existsCheckError);

  if (customerExists)
    return res.json({
      status: 'EMAIL_IN_USE',
      message: `El email ingresado ya está en uso`,
    });

  const customer = new Customer({
    name,
    lastname,
    email,
    pass,
  });

  const [, saveError] = await asyncHandler(customer.save());

  if (saveError) return next(saveError);

  return res.json({
    status: 'OK',
    customer,
  });
};

ctrl.signin = async (req, res, next) => {};

module.exports = ctrl;
