const { Model, DataTypes } = require('sequelize');

const sequelize = require('../sequelize');

class SimpleEvent extends Model {}

SimpleEvent.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    sensorId: {
      type: DataTypes.BIGINT,
    },
    event: {
      type: DataTypes.JSON,
    },
    analyzed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'SimpleEvent',
    freezeTableName: true,
    tableName: 'SimpleEvent',
    timestamps: true,
  }
);

module.exports = SimpleEvent;
