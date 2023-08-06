const CosmosClient = require('@azure/cosmos').CosmosClient;

const { config } = require('../../config-cosmos');
const { endpoint, key, databaseId, containerId } = config;

const client = new CosmosClient({ endpoint, key });

const database = client.database(databaseId);
const container = database.container(containerId);

const setEventToCosmos = async (item) => {
  if (item) {
    await container.items.create(item);
  }
};

module.exports = {
  setEventToCosmos,
};
