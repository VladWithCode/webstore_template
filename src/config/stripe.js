const { STRIPE_SK } = require('./env');
const Stripe = require('stripe');

module.exports = new Stripe(STRIPE_SK);
