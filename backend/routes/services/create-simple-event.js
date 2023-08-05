const SimpleEvent = require('../../database/models/SimpleEvent');

const createSimpleEvent = async (sensorId, event) => {
  return await SimpleEvent.create({
    sensorId: sensorId,
    event: event,
  });
};

module.exports = {
  createSimpleEvent,
};
