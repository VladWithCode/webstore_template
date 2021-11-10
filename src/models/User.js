const bcrypt = require('bcrypt');
const { Schema, model, Types } = require('mongoose');
const { asyncHandler } = require('../functions/GeneralHelpers');

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    pass: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('pass')) return next();

  const [newPass, hashPassError] = await asyncHandler(
    bcrypt.hash(this.pass, 10)
  );

  if (hashPassError) return next(hashPassError);

  return (this.pass = newPass);
});

UserSchema.methods['validatePass'] = async function (pw) {
  return await bcrypt.compare(pw, this.pass);
};

module.exports = model('User', UserSchema);
