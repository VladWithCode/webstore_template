const { STRIPE_SK } = require('./env');

const stripe = require('stripe')(STRIPE_SK);

module.exports = stripe;
