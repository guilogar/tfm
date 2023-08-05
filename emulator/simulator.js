'use strict';

const dotenv = require('dotenv');
dotenv.config();

const {
  createSimpleEvent,
} = require('../backend/routes/services/create-simple-event');

const getWindDirection = (value) => {
  if (value <= 0.25) {
    return 'N';
  } else if (value <= 0.5) {
    return 'S';
  } else if (value <= 0.75) {
    return 'E';
  } else if (value <= 1) {
    return 'O';
  }
};

setInterval(async () => {
  const sensorId = parseInt(1 + Math.random() * 100);
  const event = {
    groundHumidity: 20 + Math.random() * 20,
    litrePerMeterWater: 20 + Math.random() * 20,
    windForce: 20 + Math.random() * 20,
    countIllumination: 20 + Math.random() * 20,
    windDirection: getWindDirection(Math.random()),
    isCeilingGreenhouseOpen: Math.random() > 0.5 ? true : false,
    isWallGreenhouseOpen: Math.random() > 0.5 ? true : false,
    // roomTemperature: 20 + Math.random() * 15,
    // airHumidity: 20 + Math.random() * 20,
    // isAtDaytime: Math.random() > 0.1 ? true : false,
    // isRaining: Math.random() > 0.1 ? true : false,
    // canPhotosynthesisImprove: Math.random() > 0.1 ? true : false,
    roomTemperature: 20,
    airHumidity: 20,
    isAtDaytime: true,
    isRaining: false,
    canPhotosynthesisImprove: true,
  };

  try {
    await createSimpleEvent(sensorId, event);
  } catch (error) {
    console.error('send error: ' + error);
  }
}, process.env.TIME_INTERVAL || 30000);
