const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { asyncHandler } = require('../functions/GeneralHelpers');
const Admin = require('../models/Admin');
const User = require('../models/User');

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

// User deserialization
passport.deserializeUser(async (id, done) => {
  const [user, findError] = await asyncHandler(User.findById(id));

  if (findError) return done(findError, false);

  return done(null, user);
});

// User signin strategy
passport.use(
  'user.signin',
  new LocalStrategy(
    { usernameField: 'user', passwordField: 'pass' },
    async (user, pw, done) => {}
  )
);
