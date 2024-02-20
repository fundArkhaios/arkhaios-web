const { MongoClient } = require("mongodb");
const { createClient } = require('redis')

let redisClient;

function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_SERVER}:${process.env.REDIS_PORT}`
    });

    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    redisClient.connect().catch(console.error);
  }
  return redisClient;
}

module.exports = {
  get redis() {
    return getRedisClient();
  },
  connect: async function(callback) {
    const url = 'mongodb+srv://' + process.env.DB_NAME + ':' +
        process.env.DB_PASS + '@cluster0.' + process.env.DB_CLUSTER +
        '.mongodb.net/?retryWrites=true&w=majority';

    const client = new MongoClient(url);

    try {
      await client.connect();
      const db = client.db("db");
      await callback(db);
    } finally {
      await client.close();
    }
  }
};