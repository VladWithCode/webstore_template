const {
  registerSale,
  getSales,
  getSale,
  updateSale,
  deleteSale,
} = require('../../controllers/sale.ctrl');

const router = require('express').Router();

router.post('/', registerSale);

router.get('/', getSales);

router.get('/:id', getSale);

router.put('/:id', updateSale);

router.delete('/:id', deleteSale);

module.exports = router;
