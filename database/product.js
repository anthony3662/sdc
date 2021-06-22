const mongoose = require('./index.js');

const productSchema = mongoose.Schema({
  id: Number,
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: String,
});

let Product = mongoose.model('Product', productSchema);


let save = (array) => {
  // return Product.create({
  //   id: 11001,
  //   name: 'Camo Onesie',
  //   slogan: 'Onesie Camo',
  //   description: 'fffffffffv',
  //   category: 'Jackets',
  //   default_price: '69.00',
  //   features: [
  //     {feature: 'Soft', value: 'fabric'},
  //     {feature: 'ugly', value: 'colors'}
  //   ]
  // });
  return Product.create(array);
};

let findAll = (min, max) => {
  return  Product.find({
    id: {
      $gte: min,
      $lt: max
    }
  });

}

let find = (pid) => {
  return Product.findOne({
    id: pid
  });
}

module.exports.save = save;
module.exports.find = find;
module.exports.findAll = findAll;
