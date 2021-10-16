const { Schema, model, Types } = require('mongoose');

const CategorySchema = new Schema(
  {
    name: { type: String },
    slug: { type: String },
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
  },
  { versionKey: false }
);

module.exports = model('CategorySchema', CategorySchema);
