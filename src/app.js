process.env.NODE_ENV !== 'production' && require('dotenv').config();

// Module imports
const express = require('express');
const session = require('express-session');
const sessionStorage = require('connect-mongodb-session');
const cookieParser = require('cookie-parser');
const busboyBodyParser = require('busboy-body-parser');
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors');
const compression = require('compression');

// Inits
const app = express();

require('./config/db');
require('./config/passport');
const {
  PORT,
  DB_URI,
  SESSION_SECRET,
  COOKIE_SECRET,
  NODE_ENV,
  DOMAIN_NAME,
  CONEKTA_API_KEY,
} = require('./config/env');

const mdbStore = new (sessionStorage(session))(
  {
    collection: 'sessions',
    uri: DB_URI,
    expires: 1000 * 60 * 60 * 24, // 1 Day
  },
  err => {
    if (!err) return;

    throw err;
  }
);

/* Route Imports */
const publicRoutes = require('./routes/public.routes');
const privateRoutes = require('./routes/private.routes');

/* Misc */
const globals = require('./config/globals');
// const { isAuthenticated } = require('./functions/AuthHelpers');

// Settings
app.set('public', globals.publicDirPath);
app.set('port', PORT);

// Middlewares
app.use(cors({ origin: DOMAIN_NAME || '*' }));
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(busboyBodyParser({ limit: '30mb', multi: true }));
app.use(cookieParser(COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 Day
      sameSite: true,
    },
    store: mdbStore,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(compression({ threshold: 0 }));
// Use morgan loggin when not in production mode
(NODE_ENV !== 'production' && app.use(morgan('dev'))) ||
  app.use(morgan('common'));

// Globals
app.use((req, res, next) => {
  return next();
});

// Routes
app.use('/api/public', publicRoutes); // Public API
app.use('/api/private', /* isAuthenticated, */ privateRoutes); // Private API

// Static Files
app.use('/static', express.static(app.get('public')));

// Startup
app.listen(app.get('port'), () =>
  console.log(`Server listening on port: ${app.get('port')}`)
);
