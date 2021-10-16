const { slugifyString } = require('./GeneralHelpers');

const help = {};

help.slugifyName = function () {
  return slugifyString(this.name);
};

module.exports = help;
