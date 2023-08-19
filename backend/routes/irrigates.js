'use strict';

const express = require('express');
const router = express.Router();

const { Op } = require('sequelize');

const Irrigate = require('../database/models/Irrigate');
const FarmableLand = require('../database/models/FarmableLand');
const {
  getUserFromJwt,
  getJwtFromRequest,
} = require('../routes/services/get-user-auth');
const {
  getFilterIrrigate,
  getFilterDate,
  getFilterName,
} = require('./constants/filters');

router.get('/irrigate', async (req, res) => {
  const id = req.query.id !== undefined ? JSON.parse(req.query.id) : undefined;
  const filter = req.query.filter !== undefined ? req.query.filter : undefined;
  const farmName =
    req.query.farmName !== undefined ? req.query.farmName : undefined;
  const startDate =
    req.query.startDate !== undefined ? req.query.startDate : undefined;
  const endDate =
    req.query.endDate !== undefined ? req.query.endDate : undefined;
  const orderBy =
    req.query.orderBy !== undefined ? req.query.orderBy : 'createdAt';
  const orderDirection =
    req.query.orderDirection !== undefined ? req.query.orderDirection : 'DESC';

  const where =
    id !== undefined
      ? {
          id: id,
        }
      : {};

  if (startDate && endDate && farmName) {
    where[Op.and] = [
      ...getFilterDate({
        column: 'Irrigate.createdAt',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      }),
      ...getFilterName({ column: 'FarmableLand.name', name: farmName }),
    ];
  }

  if (filter !== undefined) {
    where[Op.or] = [...getFilterIrrigate(filter)];
  }

  const irrigates = await Irrigate.findAll({
    where: where,
    include: [{ model: FarmableLand }],
    order: [[orderBy, orderDirection]],
    limit: process.env.MAX_RESULTS,
  });

  res.status(200).send({
    irrigates: irrigates,
  });
});

router.post('/irrigate', async (req, res) => {
  const jwt = getJwtFromRequest(req);
  const user = await getUserFromJwt(jwt);

  try {
    const farm = await FarmableLand.findOne({
      where: {
        id: req.body.farmId,
        UserId: user.id,
      },
    });

    if (!farm) throw new Error();

    const irrigate = await Irrigate.create({
      amountWater: req.body.amountWater,
      lengthMinutes: req.body.lengthMinutes,
      FarmableLandId: req.body.farmId,
    });

    res.status(200).send({
      irrigate: irrigate,
    });
  } catch (error) {
    res.status(404).send({
      msg: 'invalid data',
    });
  }
});

router.put('/irrigate/:id', async (req, res) => {
  const id = req.params.id;

  const jwt = getJwtFromRequest(req);
  const user = await getUserFromJwt(jwt);

  try {
    const farm = await FarmableLand.findOne({
      where: {
        id: req.body.farmId,
        UserId: user.id,
      },
    });

    if (!farm) throw new Error();

    let irrigate = await Irrigate.findOne({
      where: {
        id: id,
      },
    });

    irrigate = await irrigate.update({
      amountWater: req.body.amountWater,
      lengthMinutes: req.body.lengthMinutes,
      FarmableLandId: req.body.farmId,
    });

    res.status(200).send({
      irrigate: irrigate,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      msg: 'invalid data',
    });
  }
});

router.delete('/irrigate/:id', async (req, res) => {
  const jwt = getJwtFromRequest(req);
  const user = await getUserFromJwt(jwt);

  await Irrigate.destroy({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).send({
    msg: 'destroyed!',
  });
});

module.exports = router;
