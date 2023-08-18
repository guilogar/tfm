const sequelize = require('../database/sequelize');
const models = require('../database/models/models');
const { createFarms } = require('./farms');
const { createIrrigate } = require('../routes/services/create-irrigate');
const { createUser } = require('../routes/services/create-user');
const { createSettings } = require('../routes/services/create-settings');
const { createSensor } = require('../routes/services/create-sensor');
const {
  createEvent,
  assignEventToUser,
} = require('../routes/services/create-event');
const {
  createNotification,
} = require('../routes/services/create-notification');
const { createCrop } = require('../routes/services/create-crop');
const {
  createPhytosanitary,
} = require('../routes/services/create-phytosanitary');
const { pNames } = require('./phytosanitaryNames');
const { randomNumberFixed } = require('../utils/random-number');
const { createCropFarm } = require('../routes/services/create-crop-farm');
const {
  createPhytosanitaryCrop,
} = require('../routes/services/create-phytosanitary-farm');
const {
  SUMMER_MONTHS,
  YEARS_TO_IRRIGATE,
  DAYS_PER_YEAR,
} = require('../routes/constants/constants');

// Re-build all tables
async function rebuildTables() {
  await sequelize.sync({
    force: true,
  });
}

// Truncate all tables
async function truncateTables() {
  for (const model of models) {
    await sequelize.sync();
    await model.truncate({ cascade: true });
    await sequelize.sync();
  }
}

// Create base data to development
async function insertDataTable() {
  // Insert user to test system
  const user = await createUser('test', 'test', 'Guillermo López García');

  await createSettings(user.id, 'es', 'WHITE', 'AUTOMATIC');

  const { farm1, farm2 } = await createFarms(user.id);

  for (let i = 0; i < 100; i++) {
    await createSensor(user.id, Math.random() > 0.5 ? farm1.id : farm2.id);
  }

  for (let i = 0; i < YEARS_TO_IRRIGATE * DAYS_PER_YEAR; i++) {
    const today = new Date();
    const targetDay = new Date();
    targetDay.setDate(today.getDate() - i);

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
      farm1.id,
      targetDay,
      targetDay
    );
    await createIrrigate(
      lengthMinutes * randomNumberFixed(minWater, maxWater, 2),
      lengthMinutes,
      farm2.id,
      targetDay,
      targetDay
    );
  }

  let events = [];
  events.push(
    await createEvent('OpenCeilingGreenHouse', 'OpenCeilingGreenHouse Event')
  );
  events.push(await createEvent('Irrigate', 'Irrigate Event'));
  events.push(await createEvent('Fertilizer', 'Fertilizer Event'));
  events.push(
    await createEvent('OpenWallGreenhouse', 'OpenWallGreenhouse Event')
  );

  await assignEventToUser(user.id, events[0].id, 'MANUAL');

  await assignEventToUser(user.id, events[1].id, 'AUTOMATIC');

  await assignEventToUser(user.id, events[2].id, 'AUTOMATIC');

  for (let i = 0; i < 5; i++) {
    const eventNotification = Math.random() > 0.5 ? events[0] : events[1];

    const title = `Evento ${eventNotification.name}`;
    const body =
      Math.random() > 0.5
        ? `El Evento ${eventNotification.name} ha sido disparado con el ` +
          `sensor "${parseInt(Math.random() * 10)}". ` +
          `Se ha realizado la accion automatizada.` +
          `Clicke aquí para mas información.`
        : `El Evento ${eventNotification.name} ha sido disparado con el ` +
          `sensor "${parseInt(Math.random() * 10)}". ` +
          `Clicke aquí para realizar la acción asociada al evento.`;

    await createNotification(title, body, user.id);
  }

  let crops = [];
  crops.push(
    await createCrop(
      'PEA',
      'El cultivo del guisante al exterior',
      'Guisantes',
      8
    )
  );
  crops.push(
    await createCrop('BEAN', 'El cultivo del frijol al exterior', 'Frijol', 8)
  );
  crops.push(
    await createCrop(
      'POTAT0',
      'El cultivo de la papa al exterior',
      'Patata',
      10
    )
  );
  crops.push(
    await createCrop(
      'TOMATO',
      'El cultivo del tomate al invernadero',
      'Tomate',
      11
    )
  );
  crops.push(
    await createCrop(
      'MELON',
      'El cultivo del melón al invernadero',
      'Melon',
      12
    )
  );
  crops.push(
    await createCrop(
      'WATERMELON',
      'El cultivo de la sandía invernadero',
      'Sandía',
      12
    )
  );
  crops.push(
    await createCrop(
      'WATERMELON',
      'El cultivo de la sandía al exterior',
      'Sandía americana',
      12
    )
  );

  for (const crop of crops) {
    await createCropFarm(Math.random() > 0.5 ? farm1.id : farm2.id, crop.id);
  }

  let phytosanitaries = [];
  phytosanitaries.push(
    await createPhytosanitary(
      'SYNTETIC_FERTILIZER',
      'Abono sintetico',
      'Abono sintetico',
      randomNumberFixed(0, 100, 2)
    )
  );
  phytosanitaries.push(
    await createPhytosanitary(
      'POTASH',
      'Potasa',
      'Potasa',
      randomNumberFixed(0, 100, 2)
    )
  );
  for (const pName of pNames) {
    phytosanitaries.push(
      await createPhytosanitary(
        pName,
        pName.toLowerCase(),
        pName.toLowerCase(),
        randomNumberFixed(0, 100, 2)
      )
    );
  }

  for (let i = 0; i < 12; i++) {
    const today = new Date();
    const targetMonth = new Date();
    targetMonth.setMonth(today.getMonth() - i);

    for (const phytosanitary of phytosanitaries) {
      const randomNumber = randomNumberFixed(0, crops.length - 1, 0);
      const crop = crops[randomNumber];
      await createPhytosanitaryCrop(
        phytosanitary.id,
        crop.id,
        Math.random() > 0.5 ? farm1.id : farm2.id,
        targetMonth,
        targetMonth
      );
    }
  }
}

module.exports = {
  rebuildTables,
  truncateTables,
  insertDataTable,
};
