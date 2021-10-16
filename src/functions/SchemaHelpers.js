const { slugifyString } = require('./GeneralHelpers');

const help = {};

help.slugifyName = function () {
  return (
    slugifyString(this.name) +
    '-' +
    this._id.slice(this._id.length - 4, this._id.length)
  );
};

module.exports = help;
