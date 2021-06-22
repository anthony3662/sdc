const mongoose = require('./index.js');

const skuSchema = mongoose.Schema({
  sku: String,
  style_id: String,
  quantity: Number,
  size: String
});

let Sku = mongoose.model('Sku', skuSchema);
let save = (array) => {
  // var sample = {
  //   sku: '295001',
  //   quantity: 2,
  //   size: '8.5'
  // };
  // var newRecord = new Sku(sample);
  // return newRecord.save();
  return Sku.create(array);
}

module.exports.save = save;