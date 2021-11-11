const { asyncHandler } = require('../functions/GeneralHelpers');
const Customer = require('../models/Customer');

const ctrl = {};

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

module.exports = ctrl;
