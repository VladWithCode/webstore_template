const passport = require('passport');
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

ctrl.signin = async (req, res, next) => {
  passport.authenticate(
    'local.signin',
    {
      successRedirect: false,
      failureRedirect: false,
    },
    async (err, customer, info) => {
      if (err) return next(err);

      if (!customer)
        return res.json({
          status: 'WRONG_USER',
          message: `Usuario no registrado`,
        });

      if (!(await customer.validatePass(req.body.pass)))
        return res.json({
          status: 'WRONG_PASS',
          message: `Contraseña incorrecta`,
        });

      req.logIn(customer, loginError => {
        if (loginError) return next(loginError);

        return res.json({
          status: 'OK',
          message: 'Autenticado con exito',
        });
      });
    }
  )(req, res, next);
};

ctrl.signOut = async (req, res, next) => {
  req.logout();

  return res.json({
    status: 'OK',
    message: `Sesión terminada con exito.`,
  });
};

module.exports = ctrl;
