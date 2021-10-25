const { Schema, model, Types } = require('mongoose');
const { slugifyName } = require('../functions/SchemaHelpers');

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, default: slugifyName },
    description: { type: String },
    price: { type: Number },
    imgs: { type: [String] },
    category: { type: String },
    stock: { type: Number, default: 1 },
    absolutePath: { type: String },
    staticPath: { type: String },
  },
  { versionKey: false }
);

module.exports = model('Product', ProductSchema);
