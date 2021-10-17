const { Schema, model, Types } = require('mongoose');

const { slugifyName } = require('../functions/SchemaHelpers');

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, default: slugifyName },
    description: { type: String },
    img: { type: String },
    subcategories: {
      type: new Schema({
        name: { type: String },
        description: { type: String },
        options: [
          new Schema(
            {
              name: { type: String },
            },
            { versionKey: false }
          ),
        ],
      }),
    },
    absolutePath: { type: String },
    staticPath: { type: String },
  },
  { versionKey: false }
);

module.exports = model('Category', CategorySchema);
