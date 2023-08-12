const CropPhytosanitary = require('../../database/models/CropPhytosanitary');

const createPhytosanitaryCrop = async (
  phytosanitaryId,
  cropId,
  farmId,
  createdAt = null,
  updatedAt = null
) => {
  return await CropPhytosanitary.create({
    PhytosanitaryId: phytosanitaryId,
    CropId: cropId,
    FarmableLandId: farmId,
    createdAt: createdAt,
    updatedAt: updatedAt,
  });
};

module.exports = {
  createPhytosanitaryCrop,
};
