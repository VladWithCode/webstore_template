const paypal = require('@paypal/checkout-server-sdk');
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, NODE_ENV } = require('./env');

const clientId = PAYPAL_CLIENT_ID;
const clientSecret = PAYPAL_CLIENT_SECRET;

const env =
  NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
const paypalClient = new paypal.core.PayPalHttpClient(env);

module.exports = paypalClient;
