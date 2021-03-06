const NODE_ENV = process.env.NODE_ENV || 'development';

const PORT = process.env.PORT || 3000;

const DB_URI = process.env.DB_URI;

const CONEKTA_API_KEY = process.env.CONEKTA_API_KEY;

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';

const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';

const SESSION_SECRET = process.env.SESSION_SECRET || 'supersecretsecret';

const COOKIE_SECRET = process.env.COOKIE_SECRET || 'keyboardcatcookies';

const DOMAIN_NAME = process.env.DOMAIN_NAME;

const STRIPE_SK = process.env.STRIPE_SK;

module.exports = {
  NODE_ENV,
  DB_URI,
  PORT,
  CONEKTA_API_KEY,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  SESSION_SECRET,
  COOKIE_SECRET,
  DOMAIN_NAME,
  STRIPE_SK,
};
