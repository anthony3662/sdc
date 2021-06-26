const mongoose = require('./index.js');

const relationshipSchema = mongoose.Schema({
  current_product_id: {type: Number, index: true }, //matches productId
  related_product_id: Number
});

let Relationship = mongoose.model('Relationship', relationshipSchema, 'relationships');
let save = (array) => {
  // var sample = {
  //   product_id: '11004',
  //   related_id: '11007'
  // };
  // var newRecord = new Relationship(relation);
  // return newRecord.save();
  return Relationship.create(array);
}

let find = (pid) => {
  return Relationship.find({
    current_product_id: pid
  });
};

module.exports.save = save;
module.exports.find = find;