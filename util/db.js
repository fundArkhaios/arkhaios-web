const { MongoClient } = require("mongodb");
const { createClient } = require('redis')
const { logger } = require('./logger')

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

  updateUser: async function(user, parameters) {
    let success = false;

    try {
      await module.exports.connect(async (db) => {
        try {
          const update = await db.collection('Users').updateOne(
            {
                "accountID": user.accountID,
            },
            {
                $set: parameters
            }
          )

          if(update.acknowledged) {
            const result = await db.collection('Users').findOne({"accountID": user.accountID});

            const key = `authenticate:${result.email}`
            const data = await module.exports.redis.get(key);

            const expiry = Math.trunc((result.sessionExpiry - Date.now()) / 1000)

            if(data) {
              if(result.sessionExpiry - Date.now() <= 0) {
                await module.exports.redis.del(key)
              } else {
                await module.exports.redis.setEx(key, expiry, JSON.stringify(result));
              }
            }

            if(result.email != user.email) {
              // This is the special scenario, in case the user updated their email
              const oldKey = `authenticate:${user.email}`
              if(await module.exports.redis.get(oldKey)) {
                await module.exports.redis.del(oldKey)
              }
            }

            success = true;
          }
        } catch(e) {
          logger.log({
            level: 'error',
            message: e
          })
        }
      });
    } catch(e) {
      logger.log({
        level: 'error',
        message: e
    })
    }

    return success;
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
    } catch(e) {
      logger.log({
        level: 'error',
        message: e
      })
    } finally {
      await client.close();
    }
  }
};