const mongoose = require('./index.js');
const styleSchema = mongoose.Schema({
  product_id: {type: Number, index: true },
  style_id: Number,
  'default?': Boolean,
  name: String,
  original_price: String,
  sale_price: String,

});

let Style = mongoose.model('Style', styleSchema);

let save = (array) => {
  // var sample = {
  //   product_id: 11003,
  //   style_id: 51004,
  //   'default?': 1,
  //   name: "Black on Gray",
  //   original_price: '69.00',
  //   sale_price: null,
  //   photos: [
  //     {thumbnail_url: 'Mucky', url: 'fabric'},
  //     {thumbnail_url: 'pretty', url: 'colors'}
  //   ],
  //   skus: ['295005', '295001']
  // };
  // var newRecord = new Style(sample);
  // return newRecord.save();
  return Style.create(array);
}

let find = (pid) => {
  return Style.find({
    product_id: pid
  });
}

module.exports.save = save;
module.exports.find = find;