const db = require('../../util/db.js');
const logger = require('../../util/logger.js');
const { RESPONSE_TYPE } = require('../response_type.js')

module.exports = {
    route: '/api/fund/join',
    kyc: true,
    post: async function(req, res, user) {
        let error = '';

        try {
            let fund = null;
            const { fundID, type, inquiry } = req.body;

            await db.connect(async (db) => {
                try {
                    fund = await db.collection('FundPortfolios').findOne({fundID});
                    if(!fund) error = 'invalid fund';
                } catch(e) {
                    res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'});
                    return;
                }

                if(fund) {
                    if(type == 'request') {
                        if(fund.members.includes(user.accountID)) {
                            res.status(401).json({status: RESPONSE_TYPE.FAILED, message: 'you are already in this fund'})
                            return
                        }

                        let requested = fund.memberRequests.filter((request) => request.user == user.accountID).length;
                        if(requested) {
                            res.status(401).json({status: RESPONSE_TYPE.FAILED, message: 'you have already requested to join this fund'})
                            return
                        }

                        if(!fund.publiclyAvailable) {
                            if(req.body.accessCode == fund.accessCode) {
                                await db.collection('FundPortfolios').updateOne({fundID},
                                    { $addToSet: { memberRequests: { user: user.accountID, inquiry: inquiry }},
                                })

                                res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: 'request sent'})
                            }
                            else {
                                res.status(401).json({status: RESPONSE_TYPE.FAILED, message: 'invalid access code'});
                            }
                        } else {
                            await db.collection('FundPortfolios').updateOne({fundID},
                                { $addToSet: { memberRequests: { user: user.accountID, inquiry: inquiry }},
                            })

                            res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: 'request sent'})
                        }
                        
                    } else if(type == 'response') {
                        if(!fund.portfolioManagers.includes(user.accountID)) {
                            return res.status(401).json({ status: RESPONSE_TYPE.FAILED, message: 'unauthorized', data: {}});
                        }

                        const requester = req.body.requester;
                        const action = req.body.action;

                        let requested = fund.memberRequests.filter((request) => request.user == requester).length;
                        if(requested) {
                            if(action == 'accept') {
                                try { 
                                    await db.collection('FundPortfolios').updateOne({fundID},
                                        { $pull: { memberRequests: { user: requester } },
                                        $addToSet: { members: requester }
                                    })

                                    await db.collection('Friends').updateOne({
                                        accountID: fund.fundFounder
                                    }, {
                                        $addToSet: { friends: requester }
                                    }, {upsert: true})

                                    await db.collection('Friends').updateOne({
                                        accountID: requester
                                    }, {
                                        $addToSet: { friends: fund.fundFounder }
                                    }, {upsert: true})

                                    res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: 'user accepted into fund'});
                                } catch(e) {
                                    res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'});
                                    return
                                }
                            } else if(action == 'reject') {
                                try {
                                    await db.collection('FundPortfolios').updateOne({fundID},
                                        { $pull: { memberRequests: { user: requester } } });

                                    res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: 'user rejected'});
                                } catch(e) {
                                    res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'});
                                    return
                                }  
                            } else {
                                res.status(401).json({status: RESPONSE_TYPE.FAILED, message: 'valid actions are either accept/reject'});
                                return
                            }
                        } else {
                            res.status(401).json({status: RESPONSE_TYPE.FAILED, message: 'invalid user'});
                            return
                        }
                    }
                } else {
                    error = 'invalid type';
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