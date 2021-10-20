const PORT = process.env.PORT || 3000;

const DB_URI = process.env.DB_URI || `mongodb://localhost:27017/store`;

const CONEKTA_API_KEY =
  process.env.CONEKTA_API_KEY || 'key_C2FsHzjtVkyQwwF6gKnSTA';

module.exports = {
  DB_URI,
  PORT,
  CONEKTA_API_KEY,
};
