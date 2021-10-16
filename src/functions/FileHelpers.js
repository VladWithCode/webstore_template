const fs = require('fs/promises');
const _path = require('path');

const help = {};

help.createDirectory = async (path, recursive) => {
  await fs.mkdir(path, { recursive });
};

help.writeFile = async (file, path) => {
  await fs.writeFile(path, file);
};

help.deleteFileOrDirectory = async (path, rf) => {
  await fs.rm(path, { recursive: rf, force: rf });
};

module.exports = help;
