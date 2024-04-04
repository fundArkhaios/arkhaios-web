const { client } = require('../plaid_configs');
const db = require('../../util/db');
const { forward, backward } = require('../aes');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');
const logger = require('../../util/logger');

module.exports = {
    route: '/api/friends/get-friends',
    authenticate: true,
    get: async function (req, res, user) {
        try {
            await db.connect(async (db) => {
                try {
                    const self = await db.collection('Friends').findOne({
                        accountID: user.accountID
                    });

                    let results = {
                        receivedRequests: [],
                        sentRequests: [],
                        friends: [],
                        blocked: []
                    };

                    const receivedRequests = self?.receivedRequests || [];
                    const sentRequests = self?.sentRequests || [];
                    const friends = self?.friends || [];
                    const blocked = self?.blocked || [];

                    const ids = []

                    for(let i in receivedRequests) {
                        ids.push({ accountID: receivedRequests[i] });
                    }

                    for(let i in sentRequests) {
                        ids.push({ accountID: sentRequests[i] });
                    }

                    for(let i in friends) {
                        ids.push({ accountID: friends[i] });
                    }

                    for(let i in blocked) {
                        ids.push({ accountID: blocked[i] });
                    }
                    
                    const users = await db.collection('Users').find({$or: ids}).toArray();

                    if(users) {
                        for(let i in users) {
                            for(let j in receivedRequests) {
                                if(receivedRequests[j] == users[i].accountID) {
                                    results.receivedRequests.push({
                                        username: users[i].username,
                                        id: users[i].accountID
                                    });
                                }
                            }

                            for(let j in sentRequests) {
                                if(sentRequests[j] == users[i].accountID) {
                                    results.sentRequests.push({
                                        username: users[i].username,
                                        id: users[i].accountID
                                    });
                                }
                            }

                            for(let j in friends) {
                                if(friends[j] == users[i].accountID) {
                                    results.friends.push({
                                        username: users[i].username,
                                        id: users[i].accountID
                                    });
                                }
                            }

                            for(let j in blocked) {
                                if(blocked[j] == users[i].accountID) {
                                    results.blocked.push({
                                        username: users[i].username,
                                        id: users[i].accountID
                                    });
                                }
                            }
                        }
                    }

                    return res.status(200).json({ status: RESPONSE_TYPE.SUCCESS, message: "", data: results });
                } catch(e) {
                    logger.log({
                        level: 'error',
                        message: e
                    })

                    SERVER_ERROR(res);
                }
            });
            
        } catch(e) {
            logger.log({
                level: 'error',
                message: e
            })

            SERVER_ERROR(res);
            return res;
        }
    }
}