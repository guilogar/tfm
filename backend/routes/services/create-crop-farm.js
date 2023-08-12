const FarmableLandCrop = require('../../database/models/FarmableLandCrop');

const createCropFarm = async (farmId, cropId) => {
  return await FarmableLandCrop.create({
    FarmableLandId: farmId,
    CropId: cropId,
  });
};

module.exports = {
  createCropFarm,
};
