const Phytosanitary = require('../../database/models/Phytosanitary');

const createPhytosanitary = async (name, description, alias, price = 0.0) => {
  return await Phytosanitary.create({
    name: name,
    description: description,
    alias: alias,
    price: price,
  });
};

module.exports = {
  createPhytosanitary,
};
