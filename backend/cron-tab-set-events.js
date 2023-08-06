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
const Event = require('./database/models/Event');

const COMPLEX_EVENT_VERIFICATION_FUNCTIONS = require('./routes/constants/event-verification-functions');

const initCronTabSetEvents = async () => {
  let timeFrames = [];

  const complexEvents = await Event.findAll();
  for (const complexEvent of complexEvents) {
    const callbackEmit = async (event) => {
      const { eventFired, sensorId, events } = event;
      if (eventFired) {
        await setEventToCosmos({
          sensorId: sensorId, // sensor id
          EventFired: complexEvent.name, // name of the event
          count: events.length, // quantity of simple events
        });
      }
    };
    const periodic = createTimeFrameEvent({
      verificationFunction:
        COMPLEX_EVENT_VERIFICATION_FUNCTIONS[complexEvent.name],
      callbackEmit,
    });

    timeFrames.push(periodic);
  }

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
        for (const timeFrame of timeFrames) {
          timeFrame.enqueue(event);
        }
        await simpleEvent.update({
          analyzed: true,
        });
      }
      for (const timeFrame of timeFrames) {
        timeFrame.tick();
      }
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = {
  initCronTabSetEvents,
};
