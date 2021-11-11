const { getCustomer } = require('../../controllers/customer.ctrl');

const router = require('express').Router();

router.get('/:id', getCustomer);

module.exports = router;
