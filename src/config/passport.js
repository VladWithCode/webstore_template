const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const Admin = require('../models/Admin');

passport.deserializeUser(async (id, done) => {
  try {
    done(null, await Admin.findById(id));
  } catch (err) {
    done(err, false);
  }
});

passport.serializeUser((_, admin, done) => {
  done(null, admin);
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
      try {
        const admin = await Admin.findOne({ name: user.toLowerCase() });

        if (!admin) {
          return done(undefined, false, {
            message: `El usuario ${user} no existe.`,
          });
        }

        return done(undefined, admin);
      } catch (err) {
        done(err, false, { message: 'Error al iniciar sesión' });
      }
    }
  )
);
