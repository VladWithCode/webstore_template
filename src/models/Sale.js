const { Schema, model, Types } = require('mongoose');
const nanoid = require('nanoid').nanoid;

const SaleSchema = new Schema(
  {
    _id: { type: String, default: () => nanoid(8) },
    customer: new Schema(
      {
        name: String,
        phone: String,
        email: String,
      },
      { _id: false, versionKey: false }
    ),
    address: new Schema(
      {
        street: String,
        col: String,
        zip: Number,
        extNumber: String,
        intNumber: String,
        refs: String,
      },
      { versionKey: false, _id: false, id: false }
    ),
    items: [
      new Schema({
        product: { type: Types.ObjectId, ref: 'Product' },
        name: { type: String },
        size: { type: String, enum: ['S', 'M', 'L', 'XL'] },
        qty: { type: Number, default: 1 },
        price: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      }),
    ],
    payment: new Schema(
      {
        _id: { type: String },
        token: { type: String },
        method: { type: String, enum: ['paypal', 'tarjeta'] },
        // payerId: { type: String },
        paid: { type: Boolean, default: false },
        paidAt: { type: Date, default: null },
        subtotal: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        shipment: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
        paypalFee: { type: Number, default: 0 },
        earnings: { type: Number, default: 0 },
      },
      { _id: false, id: false }
    ),
  },
  { _id: false, id: false, timestamps: true }
);

module.exports = model('Sale', SaleSchema);
