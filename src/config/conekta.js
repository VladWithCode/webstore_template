const conekta = require('conekta');
const { CONEKTA_API_KEY } = require('./env');

conekta.api_key = CONEKTA_API_KEY;
conekta.locale = 'es';

module.exports = conekta;
