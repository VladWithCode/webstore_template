const Product = require('../models/Product');
const Sale = require('../models/Sale');

// const asyncOp = require('../functions/asyncOperation');

const ctrl = {};

ctrl.registerSale = async (req, res, next) => {
  const { saleData, deliveryPrice } = req.body;

  const sale = new Sale(saleData);

  const saleItemsPromises = [];
  /* 
  if (saleData.items && saleData.items.length > 0) {
    for (let item of saleData.items) {
      const saleItemPromise = asyncOp(async () => {
        const product = await Product.findById(item.product).lean();
        const options = [];
        const extras = [];
        let itemTotal = product.price * item.qty;

        product.options.forEach(productOption => {
          const saleOption = item.options.find(
            saleOption => String(saleOption._id) === String(productOption._id)
          );

          if (!saleOption) return;

          const optionTotal = productOption.price * saleOption.qty;

          options.push({
            title: productOption.title,
            qty: saleOption.qty,
            price: productOption.price,
            total: optionTotal,
          });

          itemTotal += optionTotal;
        });

        product.extras.forEach(productExtra => {
          const saleExtra = item.extras.find(
            saleExtra => String(saleExtra._id) === String(productExtra._id)
          );

          if (!saleExtra) return;

          const extraTotal = productExtra.price * saleExtra.qty;

          extras.push({
            title: productExtra.title,
            qty: saleExtra.qty,
            price: productExtra.price,
            total: extraTotal,
          });

          itemTotal += extraTotal;
        });

        sale.payment.subtotal += itemTotal;

        return {
          product: item.product,
          title: item.title,
          qty: item.qty,
          price: product.price,
          subtotal: product.price * item.qty,
          options,
          extras,
          total: itemTotal,
        };
      });

      saleItemsPromises.push(saleItemPromise);
    }
  }
 */
  sale.items = await Promise.all(saleItemsPromises);

  return res.json({
    status: 'OK',
    sale,
  });
};

ctrl.getSales = async (req, res) => {
  const {} = req.query;
};

ctrl.getSale = async (req, res) => {
  const { id } = req.params;

  const sale = await Sale.findById(id);

  if (!sale) {
    return res.json({
      status: 'NOT_FOUND',
      message: `No se encontró venta con id: ${id}`,
    });
  }

  return res.json({
    status: 'OK',
    sale,
  });
};

ctrl.updateSale = async (req, res, next) => {
  const { id } = req.params;
  const { saleData } = req.body;

  const sale = Sale.findById(id);

  if (!sale) {
    return res.json({
      status: 'NOT_FOUND',
      message: `No existe venta con id ${id}`,
    });
  }
};

ctrl.deleteSale = async (req, res, next) => {
  const { id } = req.params;

  const sale = Sale.findById(id);
};

ctrl.cancelSale = async (req, res, next) => {
  const { id } = req.params;

  const sale = Sale.findById(id);
  ostman;
};

module.exports = ctrl;
