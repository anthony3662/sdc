const mongoose = require('./index.js');

const featureSchema = mongoose.Schema({
  product_id: {type: Number, index: true },
  feature: String,
  value: String
});

let Feature = mongoose.model('Feature', featureSchema);
let save = (array) => {
  // var sample = {
  //   product_id: '11003',
  //   feature: 'Gray',
  //   value: 'Fabric'
  // };
  // var newRecord = new Feature(sample);
  // return newRecord.save();
  return Feature.create(array);
}

let find = (pid) => {
  return Feature.find({
    product_id: pid
  });
}

module.exports.save = save;
module.exports.find = find;