const mongoose = require('./index.js');

const relationshipSchema = mongoose.Schema({
  current_product_id: String,
  related_product_id: String
});

let Relationship = mongoose.model('Relationship', relationshipSchema);
let save = (array) => {
  // var sample = {
  //   product_id: '11004',
  //   related_id: '11007'
  // };
  // var newRecord = new Relationship(relation);
  // return newRecord.save();
  return Relationship.create(array);
}

module.exports.save = save;