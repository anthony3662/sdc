const {DataTypes} = require('sequelize');
var sequelize = require('./index.js');

const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  slogan: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  default_price: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '0.00'
  }
});

const Feature = sequelize.define('Feature', {
  feature: DataTypes.STRING,
  value: DataTypes.STRING,
  product_id : DataTypes.STRING
});

Product.sync();
Feature.sync();
module.exports = {
  getAll: function() {
    return Product.findAll();
  },
  create: function(product) {
    var sampleP = {
      product_id: '11001',
      name: 'Camo onesie',
      slogan: 'Camo Kenny',
      description: 'fedeqwdwqd',
      category: 'jackets',
      default_price: '69.00'
    };
    var sampleF = {
      feature: 'Soft',
      value: 'Fabric',
      product_id: '11001'
    };
    var promises = [];
    promises.push(Product.create(sampleP));
    promises.push(Feature.create(sampleF));
    return Promise.all(promises);
  }
};