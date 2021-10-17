const help = {};

help.slugifyString = str => str.split(' ').join('-');

help.asyncHandler = async p => {
  try {
    return [await p, null];
  } catch (err) {
    return [null, err];
  }
};

help.safeRound = n => {
  return Math.round(n * 100) / 100;
};

module.exports = help;
