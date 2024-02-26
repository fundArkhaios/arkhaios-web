const db = require('../../util/db.js');
const RESPONSE_TYPE = require('../response_type.js')
const { v4: uuidv4 } = require('uuid');

const { logger } = require('../../util/logger')

const { fundPeriod, fundPeriods, fundType } = require('./exports.js')

module.exports = {
    route: '/api/fund/create',
    kyc: true,
    post: async function(req, res, user) {
        try {
            const { name, description, disbursementPeriod, disbursementType, public } = req.body;

            if(name.length <= 2) {
                res.status(401).json({status: RESPONSE_TYPE.ERROR, message: "Fund name must be at least 2 characters"});
            } else {
                if(!disbursementPeriod || !(disbursementPeriod in fundPeriods)) {
                    res.status(401).json({status: RESPONSE_TYPE.ERROR, message: "Invalid fund disbursement period"});
                } else if(!disbursementType || !(disbursementType in fundType)) {
                    res.status(401).json({status: RESPONSE_TYPE.ERROR, message: "Invalid fund disbursement type"});
                }

                let data = {};
                
                data["fundName"] = name;
                data["fundID"] = uuidv4();
                data["fundDescription"] = description;
                data["portfolioManagers"] = [user.accountID];
                data["publiclyAvailable"] = public;

                data["fundValue"] = 0;

                data["accessCode"] = Array.from({length: 6},
                    () => randomInt(10)).join('');

                data["memberRequests"] = [];
                
                data["members"] = [];
                
                data["fundDisbursementPeriod"] = disbursementPeriod;

                data["disbursementType"] = disbursementType;
                
                data["dateCreated"] = Date.now();

                data["availableBalance"] = 0;

                data["withdrawableFunds"] = 0;

                data["inJournals"] = [];

                data["outJournals"] = [];
                
                // Insert into securitiesPosition/orders
                
                //data["securitiesPositionID"] = 
                //data["ordersID"] = ;
            }

            await db.connect(async (db) => {
                try {
                    await db.collection('FundPortfolios').insertOne(data);
                    res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: 'fund successfully created', data: {fundID: fund["fundID"]}});
                } catch(e) {
                    logger.log({
                        level: 'error',
                        message: e
                    })

                    res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'});
                }
            });
        } catch(e) {
            logger.log({
                level: 'error',
                message: e
            })

            res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'});
        }
    }
}