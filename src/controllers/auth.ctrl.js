const User = require('../models/User');

const ctrl = {};

ctrl.singup = async (req, res, next) => {
  const { name, email, pass } = req.body;

  const [userExists, existsCheckError] = await User.exists({ email });

  if (existsCheckError) return next(existsCheckError);

  if (userExists)
    return res.json({
      status: 'EMAIL_IN_USE',
      message: `El email ingresado ya está en uso`,
    });

  const user = new User({
    name,
    email,
    pass,
  });
};

module.exports = ctrl;
