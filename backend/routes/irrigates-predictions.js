'use strict';

const express = require('express');
const router = express.Router();

const { Op } = require('sequelize');

const IrrigatePredictions = require('../database/models/IrrigatePredictions');
const FarmableLand = require('../database/models/FarmableLand');
const {
  getFilterIrrigatePredictions,
  getFilterDate,
  getFilterName,
} = require('./constants/filters');

router.get('/irrigate-predictions', async (req, res) => {
  const id = req.query.id !== undefined ? JSON.parse(req.query.id) : undefined;
  const filter = req.query.filter !== undefined ? req.query.filter : undefined;
  const farmName =
    req.query.farmName !== undefined ? req.query.farmName : undefined;
  const startDate =
    req.query.startDate !== undefined ? req.query.startDate : undefined;
  const endDate =
    req.query.endDate !== undefined ? req.query.endDate : undefined;
  const orderBy = req.query.orderBy !== undefined ? req.query.orderBy : 'date';
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
        column: 'IrrigatePredictions.date',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      }),
      ...getFilterName({ column: 'FarmableLand.name', name: farmName }),
    ];
  }

  if (filter !== undefined) {
    where[Op.or] = [...getFilterIrrigatePredictions(filter)];
  }

  const irrigatesPredicted = await IrrigatePredictions.findAll({
    where: where,
    include: [{ model: FarmableLand }],
    order: [[orderBy, orderDirection]],
    limit: process.env.MAX_RESULTS,
  });

  res.status(200).send({
    irrigatesPredicted: irrigatesPredicted,
  });
});

module.exports = router;
