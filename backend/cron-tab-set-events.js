// # ┌────────────── second (optional)
// # │ ┌──────────── minute
// # │ │ ┌────────── hour
// # │ │ │ ┌──────── day of month
// # │ │ │ │ ┌────── month
// # │ │ │ │ │ ┌──── day of week
// # │ │ │ │ │ │
// # │ │ │ │ │ │
// # * * * * * *
const cron = require('node-cron');
const { setEventToCosmos } = require('./routes/services/set-event-to-cosmos');
const { createTimeFrameEvent } = require('./eep');

const SimpleEvent = require('./database/models/SimpleEvent');

const initCronTabSetEvents = () => {
  // For Irrigate Complex Event
  const verificationFunction = (event) => {
    const { isAtDaytime, isRaining, airHumidity, roomTemperature } = event;
    return (
      isAtDaytime === true &&
      isRaining === false &&
      airHumidity < 30 &&
      roomTemperature < 25
    );
  };
  const callbackEmit = async (event) => {
    const { eventFired, sensorId, events } = event;
    if (eventFired) {
      await setEventToCosmos({
        sensorId: sensorId, // sensor id
        EventFired: 'Irrigate', // name of the event
        count: events.length, // quantity of events
      });
    }
  };
  const periodic = createTimeFrameEvent({
    verificationFunction,
    callbackEmit,
  });

  cron.schedule('* * * * *', async () => {
    try {
      const simpleEvents = await SimpleEvent.findAll({
        where: {
          analyzed: false,
        },
      });
      for (const simpleEvent of simpleEvents) {
        const event = {
          ...simpleEvent.event,
          sensorId: parseInt(simpleEvent.sensorId),
        };
        periodic.enqueue(event);

        await simpleEvent.update({
          analyzed: true,
        });
      }
      periodic.tick();
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = {
  initCronTabSetEvents,
};
