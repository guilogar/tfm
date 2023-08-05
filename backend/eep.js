const eep = require('eep');

const createTimeFrameEvent = ({
  verificationFunction = () => {},
  callbackEmit = () => {},
}) => {
  const EEPFunction = function (verificationFunction) {
    let self = this;
    let events = [];
    let eventFired = false;
    let sensorId = null;
    self.init = function () {
      events = [];
    };
    self.accumulate = function (event) {
      events.push({
        event: event,
        passVerification: verificationFunction(event),
      });
      sensorId = events[0].event.sensorId;

      if (events.length > 1) {
        eventFired = eventFired && events[events.length - 1].passVerification;
      } else if (events.length === 1) {
        eventFired = events[events.length - 1].passVerification;
      }
    };
    self.emit = function () {
      return { eventFired: eventFired, sensorId: sensorId, events: events };
    };
    self.make = function () {
      return new EEPFunction(verificationFunction);
    };
  };

  const periodic = eep.EventWorld.make()
    .windows()
    .monotonic(new EEPFunction(verificationFunction), new eep.CountingClock());
  periodic.on('emit', callbackEmit);

  return periodic;
};

module.exports = {
  createTimeFrameEvent,
};
