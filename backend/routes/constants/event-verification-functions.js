'use strict';

const OpenCeilingGreenHouseVerificationFunction = (event) => {
  const { isAtDaytime, isRaining } = event;
  return isAtDaytime === true && isRaining === false;
};

const IrrigateVerificationFunction = (event) => {
  const { isAtDaytime, isRaining, airHumidity, roomTemperature } = event;
  return (
    isAtDaytime === true &&
    isRaining === false &&
    airHumidity < 30 &&
    roomTemperature < 25
  );
};

const FertilizerVerificationFunction = (event) => {
  const { isAtDaytime, isRaining, canPhotosynthesisImprove, airHumidity } =
    event;
  return (
    isAtDaytime === true &&
    isRaining === true &&
    canPhotosynthesisImprove === true &&
    airHumidity < 30
  );
};

const OpenWallGreenhouseVerificationFunction = (event) => {
  const { windForce, isRaining, roomTemperature } = event;
  return windForce < 30 && isRaining === false && roomTemperature > 25;
};

module.exports = {
  OpenCeilingGreenHouse: OpenCeilingGreenHouseVerificationFunction,
  Irrigate: IrrigateVerificationFunction,
  Fertilizer: FertilizerVerificationFunction,
  OpenWallGreenhouse: OpenWallGreenhouseVerificationFunction,
};
