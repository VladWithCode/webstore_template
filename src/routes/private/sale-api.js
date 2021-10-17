const {
  registerSale,
  getSales,
  getSale,
  updateSale,
  deleteSale,
  initSale,
} = require('../../controllers/sale.ctrl');

const router = require('express').Router();

router.post('/', registerSale);

router.get('/', getSales);

router.get('/init', initSale);

router.get('/:id', getSale);

router.put('/:id', updateSale);

router.delete('/:id', deleteSale);

module.exports = router;
