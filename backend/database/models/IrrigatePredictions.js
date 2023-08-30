const { Model, DataTypes } = require('sequelize');

const sequelize = require('../sequelize');
const FarmableLand = require('./FarmableLand');

class IrrigatePredictions extends Model {}

IrrigatePredictions.init(
  {
    date: {
      type: DataTypes.DATE,
      primaryKey: true,
    },
    FarmableLandId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    amountWater: DataTypes.DOUBLE,
    lengthMinutes: DataTypes.DOUBLE,
  },
  {
    sequelize,
    modelName: 'IrrigatePredictions',
    freezeTableName: true,
    tableName: 'IrrigatePredictions',
    timestamps: false,
  }
);

IrrigatePredictions.belongsTo(FarmableLand);

module.exports = IrrigatePredictions;
