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

  updateUser: async function(user, parameters) {
    try {
      await module.exports.connect(async (db) => {
        try {
          const update = await db.collection('Users').updateOne(
            {
                "email": user.accountID,
            },
            {
                $set: parameters
            }
          )

          if(update.modifiedCount == 1) {
            const result = await db.collection('Users').findOne({"email": user.accountID});

            const data = await redis.get(`authenticate:${result.email}`);
            const expiry = Math.trunc((result.sessionExpiry - Date.now()) / 1000)

            if(data) {
              await redis.setEx(key, expiry, JSON.stringify(result));
            }

            if(result.email != user.email) {
              // This is the special scenario, in case the user updated their email
              const oldKey = `authenticate:${user.email}`
              if(await redis.get(oldKey)) {
                await redis.del(oldKey)
              }
            }

            return true;
          } else return false;
        } catch(e) {
          return false;
        }
      });
    } catch(e) {
      return false;
    }
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