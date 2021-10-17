const { Schema, model, Types } = require('mongoose');
const { slugifyName } = require('../functions/SchemaHelpers');

const ProductSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, default: slugifyName },
  description: { type: String },
  price: { type: Number },
  imgs: { type: [String] },
  category: { type: String },
  subcategory: { type: String },
  absolutePath: { type: String },
  staticPath: { type: String },
});

module.exports = model('Product', ProductSchema);
