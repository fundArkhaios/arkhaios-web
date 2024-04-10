const db = require('../../util/db.js');
const { RESPONSE_TYPE } = require('../response_type.js')

const { logger } = require('../../util/logger')

module.exports = {
    route: '/api/fund/members',
    kyc: true,
    get: async function(req, res, user) {
        try {
            const id = req.query.id;

            if(!user.fundsManaging?.includes(id)) {
                return res.status(401).json({ status: RESPONSE_TYPE.FAILED, message: "unauthorized"});
            }

            await db.connect(async (db) => {
                try {
                    let fund = await db.collection('FundPortfolios').findOne({
                        fundID: id
                    });

                    let users = [];
                    let members = [];
                    let managers = [];
                    let requests = [];
                    for(let i = 0; i < fund.members?.length; ++i) {
                        users.push({accountID: fund.members[i]});
                    }

                    for(let i = 0; i < fund.portfolioManagers?.length; ++i) {
                        users.push({accountID: fund.portfolioManagers[i]});
                    }

                    for(let i = 0; i < fund.memberRequests?.length; ++i) {
                        users.push({accountID: fund.memberRequests[i]});
                    }

                    const list = await db.collection('Users').find({$or: users}).toArray();

                    for(let i = 0; i < list.length; ++i) {
                        if(fund.portfolioManagers?.includes(list[i].accountID)) {
                            managers.push({
                                name: list[i].firstName + " " + list[i].lastName,
                                id: list[i].accountID,
                            })
                        }

                        if(fund.members?.includes(list[i].accountID)) {
                            members.push({
                                name: list[i].firstName + " " + list[i].lastName,
                                id: list[i].accountID,
                            })
                        }

                        if(fund.memberRequests?.includes(list[i].accountID)) {
                            requests.push({
                                name: list[i].firstName + " " + list[i].lastName,
                                id: list[i].accountID,
                            })
                        }
                    }

                    res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: "", data: {
                        members: members,
                        managers: managers,
                        requests: requests
                    }});
                } catch(e) {
                    logger.log({
                        level: 'error',
                        message: e
                    })
                }
            });
        } catch(e) {
            res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'});

            logger.log({
                level: 'error',
                message: e
            })
        }
    }
}