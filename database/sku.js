const mongoose = require('./index.js');

const skuSchema = mongoose.Schema({
  sku: Number,
  style_id: {type: Number, index: true },
  quantity: Number,
  size: String
});

let Sku = mongoose.model('Sku', skuSchema, 'skus');
let save = (array) => {
  // var sample = {
  //   sku: '295001',
  //   quantity: 2,
  //   size: '8.5'
  // };
  // var newRecord = new Sku(sample);
  // return newRecord.save();
  return Sku.create(array);
};
let find = (sid) => {
  return Sku.find({
    style_id: sid
  });
};


module.exports.save = save;
module.exports.find = find;
