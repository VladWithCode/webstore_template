const help = {};

help.slugifyString = str => str.split(' ').join('-');

help.asyncHandler = promise => {
  try {
    return [await promise(), null];
  } catch (err) {
    return [null, err];
  }
};

module.exports = help;
