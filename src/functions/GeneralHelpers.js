const help = {};

help.slugifyString = str => str.split(' ').join('-');

help.asyncHandler = async p => {
  try {
    return [await p, null];
  } catch (err) {
    return [null, err];
  }
};

module.exports = help;
