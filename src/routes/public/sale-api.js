const {
  registerSale,
  getSales,
  getSale,
  initSale,
} = require('../../controllers/sale.ctrl');

const router = require('express').Router();

router.post('/init', initSale);

router.post('/', registerSale);

router.get('/', getSales);

router.get('/:id', getSale);

module.exports = router;
