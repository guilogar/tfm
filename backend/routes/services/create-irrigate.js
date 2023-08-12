const Irrigate = require('../../database/models/Irrigate');

const createIrrigate = async (
  amountWater,
  lengthMinutes,
  farmId,
  createdAt = null,
  updatedAt = null
) => {
  return await Irrigate.create({
    amountWater: amountWater,
    lengthMinutes: lengthMinutes,
    FarmableLandId: farmId,
    createdAt: createdAt,
    updatedAt: updatedAt,
  });
};

module.exports = {
  createIrrigate,
};
