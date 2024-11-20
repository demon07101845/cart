const { DataTypes } = require('sequelize');
const sequelize = require('../configuration/database');
const Product = sequelize.define(
  'Product',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: 'products',
    timestamps: true,
  }
);
module.exports = Product;
