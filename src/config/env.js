const NODE_ENV = process.env.NODE_ENV || 'development';

const PORT = process.env.PORT || 3000;

const DB_URI = process.env.DB_URI || `mongodb://localhost:27017/store`;

const CONEKTA_API_KEY =
  process.env.CONEKTA_API_KEY || 'key_C2FsHzjtVkyQwwF6gKnSTA';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';

const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';

module.exports = {
  NODE_ENV,
  DB_URI,
  PORT,
  CONEKTA_API_KEY,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
};
