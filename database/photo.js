const mongoose = require('./index.js');

const photoSchema = mongoose.Schema({
  style_id: {type: Number, index: true }, //matches style id
  url: String,
  thumbnail_url: String
});

let Photo = mongoose.model('Photo', photoSchema, 'photos');
let save = (array) => {
  // var sample = {
  //   style_id: '51003',
  //   url: 'sample',
  //   thumbnail_url: 'url'
  // };
  // var newRecord = new Photo(sample);
  // return newRecord.save();
  return Photo.create(array);
};

let find = (sid) => {
  return Photo.find({
    style_id: sid
  });
};

module.exports.save = save;
module.exports.find = find;