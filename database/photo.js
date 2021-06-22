const mongoose = require('./index.js');

const photoSchema = mongoose.Schema({
  style_id: String,
  url: String,
  thumbnail_url: String
});

let Photo = mongoose.model('Photo', photoSchema);
let save = (array) => {
  // var sample = {
  //   style_id: '51003',
  //   url: 'sample',
  //   thumbnail_url: 'url'
  // };
  // var newRecord = new Photo(sample);
  // return newRecord.save();
  return Photo.create(array);
}

module.exports.save = save;