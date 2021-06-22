const {DataTypes} = require('sequelize');
var sequelize = require('./index.js');

const Style = sequelize.define('Product', {
  product_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  style_id: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  'default?': {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  original_price: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '-0.00'
  },
  sale_price: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

const Photo = sequelize.define('Photo', {
  product_id: DataTypes.STRING,
  thumbnail_url: DataTypes.STRING,
  url: DataTypes.STRING
});

Style.sync();
Photo.sync();
module.exports = {
  getAll: function() {
    return Style.findAll();
  }
};
