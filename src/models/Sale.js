const { Schema, model, Types } = require('mongoose');
const nanoid = require('nanoid').nanoid;

const SaleSchema = new Schema(
  {
    _id: { type: String, default: () => nanoid(8) },
    customer: new Schema(
      {
        name: String,
        phoneNum: String,
      },
      { _id: false, versionKey: false }
    ),
    address: new Schema(
      {
        street: String,
        col: String,
        cp: Number,
        extNumber: String,
        intNumber: String,
        refs: String,
      },
      { _id: false, id: false }
    ),
    items: [
      new Schema({
        product: { type: Types.ObjectId, ref: 'Product' },
        title: { type: String },
        qty: { type: Number },
        price: { type: Number },
        total: { type: Number },
      }),
    ],
    payment: new Schema(
      {
        _id: { type: String },
        method: { type: String, enum: ['paypal', 'tarjeta'] },
        payerId: { type: String },
        payed: { type: Boolean, default: false },
        payedAt: { type: Date, default: null },
        subtotal: { type: Number },
        tax: { type: Number },
        shipment: { type: Number },
        total: { type: Number },
      },
      { _id: false, id: false }
    ),
  },
  { _id: false, id: false, timestamps: true }
);

module.exports = model('Sale', SaleSchema);
