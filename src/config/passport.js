const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { asyncHandler } = require('../functions/GeneralHelpers');
const Admin = require('../models/Admin');
const Customer = require('../models/Customer');

passport.serializeUser((_, user, done) => {
  done(null, user);
});

// Admin deserialization
passport.deserializeUser(async (id, done) => {
  const [admin, findError] = await asyncHandler(Admin.findById(id));

  if (findError) return done(findError, false);

  if (!admin) return done('pass');

  return done(null, admin);
});

// Admin signin strategy
passport.use(
  'admin.signin',
  new LocalStrategy(
    {
      usernameField: 'user',
      passwordField: 'pass',
    },
    async (user, pw, done) => {
      const [admin, findError] = await asyncHandler(
        Admin.findOne({ name: user }).lean()
      );

      if (findError)
        return done(findError, false, { message: 'Error al iniciar sesión' });

      if (!admin) {
        return done(undefined, false, {
          message: `El usuario ${user} no existe.`,
        });
      }

      return done(undefined, admin);
    }
  )
);

// Customer deserialization
passport.deserializeUser(async (id, done) => {
  const [customer, findError] = await asyncHandler(Customer.findById(id));

  if (findError) return done(findError, false);

  return done(null, customer);
});

// Customer signin strategy
passport.use(
  'local-signin',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'pass' },
    async (email, _pw, done) => {
      const [customer, findError] = await asyncHandler(
        Customer.findOne({ email })
      );

      if (findError) return done(findError, false);

      if (!customer) return done(null, false);

      return done(null, customer);
    }
  )
);

// Customer signup strategy
/* passport.use(
  'local-signup',
  new LocalStrategy(
    {
      usernameField: 'user',
      passwordField: 'pass',
      passReqToCallback: true,
    },
    async (req, user, pw, done) => {}
  )
); */
