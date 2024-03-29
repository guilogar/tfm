const { Model, DataTypes } = require('sequelize');

const sequelize = require('../sequelize');

class Phytosanitary extends Model {}

Phytosanitary.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    alias: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.0,
    },
  },
  {
    sequelize,
    modelName: 'Phytosanitary',
    freezeTableName: true,
    tableName: 'Phytosanitary',
    timestamps: true,
  }
);

module.exports = Phytosanitary;
