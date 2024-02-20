const { MongoClient } = require("mongodb");
const {createClient} = require('redis')

module.exports = {
	redis: createClient({url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_SERVER}:${process.env.REDIS_PORT}`}),
    connect: async function(callback) {
        const url = 'mongodb+srv://' + process.env.DB_NAME + ':' +
		    process.env.DB_PASS + '@cluster0.' + process.env.DB_CLUSTER +
            '.mongodb.net/?retryWrites=true&w=majority';

        const client = new MongoClient(url);

        await client.connect();

        const db = client.db("db");
        
        await callback(db);

        await client.close();
    }
};