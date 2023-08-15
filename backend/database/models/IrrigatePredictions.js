const { Model, DataTypes } = require('sequelize');

const sequelize = require('../sequelize');
const FarmableLand = require('./FarmableLand');

class IrrigatePredictions extends Model {}

IrrigatePredictions.init(
  {
    year: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    week: {
      type: DataTypes.BIGINT,
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
