const { Schema, model, Types } = require('mongoose');

const BusinessSchema = new Schema({
  title: { type: String },
  phones: { type: [String] },
  address: { type: String },
  deliveryPrice: { type: Number },
  serviceAvailable: { type: Boolean },
  // schedule: { type: [{ open: Number }] },
  admin: { type: Types.ObjectId, ref: 'Admin', default: null },
});

module.exports = model('BusinessSchema', BusinessSchema);
