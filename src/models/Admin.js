const bcrypt = require('bcrypt');
const { Schema, model, Types } = require('mongoose');

const AdminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    pass: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

AdminSchema.pre('save', async function (next) {
  if (!this.isModified('pass')) return next();

  try {
    this.pass = await bcrypt.hash(this.pass, 10);
  } catch (err) {
    return next(err);
  }
});

AdminSchema.methods['validatePass'] = async function (pw) {
  return await bcrypt.compare(pw, this.pass);
};

module.exports = model('Admin', AdminSchema);
