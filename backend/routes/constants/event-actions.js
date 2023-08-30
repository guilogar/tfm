'use strict';

const CropPhytosanitary = require('../../database/models/CropPhytosanitary');
const FarmableLandCrop = require('../../database/models/FarmableLandCrop');
const { randomNumberFixed } = require('../../utils/random-number');
const { createIrrigate } = require('../services/create-irrigate');
const { SUMMER_MONTHS } = require('./constants');

const OpenCeilingGreenHouseAction = async (farmId) => {
  console.log('OpenCeilingGreenHouseAction');
};

const IrrigateAction = async (farmId) => {
  console.log('IrrigateAction');

  const today = new Date();
  const targetDay = new Date();
  targetDay.setDate(today.getDate());

  let minWater = 0;
  let maxWater = 5;

  const summerMonths = SUMMER_MONTHS.map((month) => month.value);

  if (summerMonths.includes(targetDay.getMonth())) {
    minWater = 10;
    maxWater = 15;
  }

  const lengthMinutes = parseInt(randomNumberFixed(50, 60, 0));
  await createIrrigate(
    lengthMinutes * randomNumberFixed(minWater, maxWater, 2),
    lengthMinutes,
    farmId,
    targetDay,
    targetDay
  );
};

const FertilizerAction = async (farmId) => {
  console.log('FertilizerAction');

  const crops = await FarmableLandCrop.findAll({
    where: {
      FarmableLandId: farmId,
    },
  });

  for (const crop of crops) {
    await CropPhytosanitary.create({
      FarmableLandId: farmId,
      CropId: crop.CropId,
      PhytosanitaryId: 1,
    });
  }
};

const OpenWallGreenhouseAction = async (farmId) => {
  console.log('OpenWallGreenhouseAction');
};

module.exports = {
  OpenCeilingGreenHouse: OpenCeilingGreenHouseAction,
  Irrigate: IrrigateAction,
  Fertilizer: FertilizerAction,
  OpenWallGreenhouse: OpenWallGreenhouseAction,
};
