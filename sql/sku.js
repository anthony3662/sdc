const {DataTypes} = require('sequelize');
var sequelize = require('./index.js');

const Sku = sequelize.define('Product', {
  product_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.NUMBER,
    allowNull: false,
    defaultValue: 0
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'undefined'
  }
});

Sku.sync();
module.exports = {
  getAll: function() {
    return Sku.findAll();
  }
};

