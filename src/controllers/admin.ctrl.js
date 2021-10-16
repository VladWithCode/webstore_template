const passport = require('passport');
const { isValidObjectId } = require('mongoose');
const Admin = require('../models/Admin');

const ctrl = {};

ctrl.login = async (req, res, next) => {
  passport.authenticate(
    'admin.signin',
    { failureRedirect: false, successRedirect: false },
    async (err, user) => {
      if (err) return next(err);

      if (!user)
        return res.json({
          status: 'WRONG_USER',
          message: 'El nombre usuario ingresado es incorrecto o no existe.',
        });

      if (!(await user.validatePass(req.body.pass))) {
        return res.json({
          status: 'WRONG_PASS',
          message: 'La contraseña ingresada es incorrecta.',
        });
      }

      req.logIn(user, err => {
        if (err) return next(err);

        return res.json({
          status: 'OK',
          message: 'Se inició sesión con exito',
        });
      });
    }
  )(req, res, next);
};

ctrl.logout = async (req, res, next) => {
  req.logout();
  return res.json({
    status: 'OK',
    message: 'Se cerró sesión con exito',
  });
};

ctrl.createAdmin = async (req, res, next) => {
  const { name, pass } = req.body;

  if (await Admin.exists({ name: name.toLowerCase() })) {
    return res.status(400).json({
      status: 'DUPLICATE_NAME',
      message: `El nombre ${name} ya esta en uso.`,
    });
  }

  const admin = new Admin({
    name,
    pass,
  });

  try {
    await admin.save();
  } catch (err) {
    return next(err);
  }

  return res.json({
    status: 'OK',
    admin,
  });
};

ctrl.getAdmins = async (req, res, next) => {
  let admins;

  try {
    admins = await Admin.find().lean();
  } catch (err) {
    return next(err);
  }

  return res.json({
    status: 'OK',
    admins,
  });
};

ctrl.getAdmin = async (req, res, next) => {
  const { id } = req.params;

  const admin = await Admin.findById(id).lean();

  if (!admin) {
    return res.json({
      status: 'NOT_FOUND',
      message: `No se encontró administrador con id ${id}`,
    });
  }

  return res.json({
    status: 'OK',
    admin,
  });
};

ctrl.updateAdmin = async (req, res, next) => {
  const { id } = req.params;
  const { name, pass, newPass } = req.body;

  try {
    const admin = await Admin.findById(id);

    if (!admin)
      return res.status(400).json({
        status: 'NOT_FOUND',
        message: `No se encontro administrador con id ${id}`,
      });

    if (name) {
      admin.name = name;
    }

    if (newPass) {
      if (!admin.validatePass(pass))
        return res.status(400).json({
          status: 'WRONG_PASS',
          message: 'La contraseña es incorrecta.',
        });

      admin.pass = newPass;
    }

    await admin.save();

    return res.json({
      status: 'OK',
      message: `Administrador actualizado con exito.`,
    });
  } catch (err) {
    return next(err);
  }
};

ctrl.deleteAdmin = async (req, res, next) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(400).json({
        status: 'NOT_FOUND',
        message: `No se encontro administrador con id ${id}`,
      });
    }

    await admin.delete();

    return res.json({
      status: 'OK',
      message: `Se eliminó correctamente al administrador ${admin.name}`,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = ctrl;
