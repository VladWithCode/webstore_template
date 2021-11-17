const bcrypt = require('bcrypt');
const { Schema, model, Types } = require('mongoose');
const { slugifyName } = require('../functions/SchemaHelpers');

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    pass: { type: String, required: true },
    history: { type: [Types.ObjectId] },
    cart: {
      items: [
        {
          product: { type: Types.ObjectId, ref: 'Product' },
          name: { type: String },
          size: { type: String },
          qty: { type: Number, default: 1 },
          price: { type: Number, default: 0 },
          total: { type: Number, default: 0 },
        },
      ],
      subtotal: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      shipment: { type: Number, default: 0 },
      total: { type: Number },
      isEmpty: { type: Boolean, default: true },
    },
    addresses: [
      {
        street: String,
        col: String,
        zip: Number,
        extNumber: String,
        intNumber: String,
        refs: String,
        isDefault: Boolean,
      },
    ],
    invoicing: [
      {
        rfc: {
          type: String,
          required: true,
          uppercase: true,
          trim: true,
          minLength: 12,
          maxLength: 13,
        },
        razon: {
          type: String,
          required: true,
        },
      },
    ],
    reviews: { type: [Types.ObjectId], ref: 'Review' },
    favorites: { type: [Types.ObjectId], ref: 'Product' },
  },
  { versionKey: false }
);

CustomerSchema.pre('save', async function (next) {
  if (!this.isModified('pass')) return next();

  try {
    this.pass = await bcrypt.hash(this.pass, 10);
  } catch (err) {
    return next(err);
  }
});

CustomerSchema.methods['validatePass'] = async function (pw) {
  return await bcrypt.compare(pw, this.pass);
};

module.exports = model('Customer', CustomerSchema);
