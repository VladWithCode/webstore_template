const { Schema, model, Types } = require('mongoose');
const { slugifyName } = require('../functions/SchemaHelpers');

const ProductSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, default: slugifyName },
  description: { type: String },
  img: { type: String },
  available: { type: Boolean, default: true },
  active: { type: Boolean, default: true },
  stock: [
    new Schema({
      name: { type: String },
      color: { type: String },
      size: { type: String },
      price: { type: Number },
      qty: { type: Number },
      imgs: { type: [String] },
    }),
  ],
  absolutePath: { type: String },
  staticPath: { type: String },
});

module.exports = model('ProductSchema', ProductSchema);
