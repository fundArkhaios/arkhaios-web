const db = require('../../util/db.js');
const { randomInt } = require('node:crypto')
const {RESPONSE_TYPE} = require('../response_type.js')
const { v4: uuidv4 } = require('uuid');

const { logger } = require('../../util/logger')

const { fundPeriods, fundType } = require('./exports.js')

module.exports = {
    route: '/api/fund/create',
    kyc: true,
    post: async function(req, res, user) {
        try {
            // Required parameters: name, description, disbursement period, disbursement type, public (y/n)
            // Valid disbursement periods and types can be seen within fund/exports.js
            const { name, description, disbursementPeriod, disbursementType, public } = req.body;

            if(name.length <= 2) {
                res.status(401).json({status: RESPONSE_TYPE.ERROR, message: "Fund name must be at least 2 characters"});
            } else {
                if(!disbursementPeriod || !fundPeriods.includes(disbursementPeriod)) {
                    return res.status(401).json({status: RESPONSE_TYPE.ERROR, message: "Invalid fund disbursement period"});
                } else if(!disbursementType || !fundType.includes(disbursementType)) {
                    return res.status(401).json({status: RESPONSE_TYPE.ERROR, message: "Invalid fund disbursement type"});
                }

                let data = {};
                
                data["fundName"] = name;
                data["fundID"] = uuidv4();
                data["fundDescription"] = description;
                data["portfolioManagers"] = [user.accountID];
                data["fundFounder"] = user.accountID;
                data["publiclyAvailable"] = public;

                data["fundValue"] = 0;

                data["accessCode"] = Array.from({length: 6},
                    () => randomInt(10)).join('');

                data["memberRequests"] = [];
                
                data["members"] = [];
                
                data["fundDisbursementPeriod"] = disbursementPeriod;

                data["disbursementType"] = disbursementType;
                
                data["dateCreated"] = Date.now();

                data["availableBalance"] = "0";

                data["withdrawableFunds"] = "0";

                data["inJournals"] = [];

                data["outJournals"] = [];

                let created = false;

                await db.connect(async (db) => {
                    try {
                        let fund = await db.collection('FundPortfolios').findOne({"fundFounder": user.accountID});
                        if(fund) {
                            return res.status(200).json({status: RESPONSE_TYPE.FAILED, message: 'cannot create multiple funds', data: {}});
                        } else {
                            await db.collection('FundPortfolios').insertOne(data);

                            created = true;
                        }
                    } catch(e) {
                        logger.log({
                            level: 'error',
                            message: e
                        })

                        res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'});
                    }
                });

                if(created) {
                    await db.updateUser(user, { fundsManaging: data["fundID"] }, "$push");
                    res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: 'fund successfully created', data: {fundID: data["fundID"]}});
                }
            }
        } catch(e) {
            logger.log({
                level: 'error',
                message: e
            })

            res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'});
        }
    }
}