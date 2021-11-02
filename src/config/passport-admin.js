const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { asyncHandler } = require('../functions/GeneralHelpers');
const Admin = require('../models/Admin');

passport.serializeUser((_, admin, done) => {
  done(null, admin);
});

passport.deserializeUser(async (id, done) => {
  const [admin, findError] = await asyncHandler(Admin.findById(id));

  if (findError) return done(findError, false);

  return done(null, admin);
});

passport.use(
  'admin.signin',
  new LocalStrategy(
    {
      usernameField: 'user',
      passwordField: 'pass',
      passReqToCallback: true,
    },
    async (req, user, pw, done) => {
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
