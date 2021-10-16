const { Schema, model, Types } = require('mongoose');

const cartSchema = new Schema(
  {
    device: { type: String, default: null },
    user: { type: String, default: null },
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shipment: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    items: {
      type: new Schema({
        parent: { type: String, ref: 'Product', required: true },
        ogItem: { type: String, required: true },
        qty: { type: Number, default: 1 },
        totalPrice: { type: number, default: 0 },
      }),
    },
  },
  { versionKey: false }
);

module.exports = model('cartSchema', cartSchema);
