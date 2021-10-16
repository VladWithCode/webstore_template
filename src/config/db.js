const mongoose = require('mongoose');

const DB_URI = `mongodb://localhost:27017/store`;

mongoose.connect(DB_URI, err => {
  if (err) {
    return console.log('Error while connecting to DB');
  }

  console.log('Connected to DB');
});

module.exports = mongoose;
