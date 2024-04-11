const { MongoClient } = require("mongodb");
const { createClient } = require('redis')
const { logger } = require('./logger')

let redisClient;

function getRedisClient() {
  try {
    if (!redisClient) {
      redisClient = createClient({
        url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_SERVER}:${process.env.REDIS_PORT}`
      });

      console.log("call");
      redisClient.on('error', (err) => console.log('Redis Client Error', err));
      redisClient.connect().catch(console.error);
    }
  } catch(e) {}

  return redisClient;
}

module.exports = {
  get redis() {
    return getRedisClient();
  },

  redis_del: async function(key) {
    let action = getRedisClient().del(key);
    let timeout = new Promise((resolve, reject) => {
      let timer = setTimeout(() => {
        clearTimeout(timer);
        reject();
      }, 1000);
    });

    return Promise.race([action, timeout]);
  },

  redis_get: async function(key) {
    let action = getRedisClient().get(key);
    let timeout = new Promise((resolve, reject) => {
      let timer = setTimeout(() => {
        clearTimeout(timer);
        reject();
      }, 1000);
    });

    return Promise.race([action, timeout]);
  },

  redis_set: async function(key, expiry, data) {
    let action = getRedisClient().setEx(key, expiry, data);
    let timeout = new Promise((resolve, reject) => {
      let timer = setTimeout(() => {
        clearTimeout(timer);
        reject();
      }, 1000);
    });

    return Promise.race([action, timeout]);
  },

  updateUser: async function(user, parameters, option) {
    let dbOption = option || "$set";
    let success = false;

    try {
      await module.exports.connect(async (db) => {
        try {
          const filter = user.accountID ? { "accountID": user.accountID } : { "email": user.email };

          const update = await db.collection('Users').updateOne(
            filter,
            {
                [`${dbOption}`]: parameters
            }
          )

          if(update.acknowledged) {
            const result = await db.collection('Users').findOne(filter);

            const key = `authenticate:${result.email}`
            const data = await module.exports.redis_get(key);

            const expiry = Math.trunc((result.sessionExpiry - Date.now()) / 1000)

            if(data) {
              if(result.sessionExpiry - Date.now() <= 0) {
                await module.exports.redis_del(key)
              } else {
                await module.exports.redis_set(key, expiry, JSON.stringify(result));
              }
            }

            if(result.email != user.email) {
              // This is the special scenario, in case the user updated their email
              const oldKey = `authenticate:${user.email}`
              if(await module.exports.redis_get(oldKey)) {
                await module.exports.redis_del(oldKey)
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