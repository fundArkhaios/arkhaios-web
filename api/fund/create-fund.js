const db = require('../../util/db.js');
const authenticate = require('../../util/authenticate.js')
const RESPONSE_TYPE = require('../response_type.js')

module.exports = {
    route: '/api/create-fund',
    kyc: true,
    post: async function(req, res, user) {
        try {
            const { name, description, disbursementPeriod, disbursementType, public } = req.body;

            if(name.length <= 2) {
                res.status(401).json({status: RESPONSE_TYPE.ERROR, message: "Fund name must be at least 2 characters"});
            } else {
                if(!disbursementType || (disbursementType != "quarterly" && disbursementType != "monthly")) {
                    res.status(401).json({status: RESPONSE_TYPE.ERROR, message: "Disbursement type must be weekly/quarterly"});
                } else if(!disbursementPeriod || (disbursementPeriod != "2/20" && disbursementPeriod != "3/30")) {
                    res.status(401).json({status: RESPONSE_TYPE.ERROR, message: "Fund disbursement must be 2/20 or 3/30"});
                }

                let data = {};
                
                data["fundName"] = name;
                data["fundDescription"] = description;
                data["portfolioManagers"] = [user._id];
                data["publiclyAvailable"] = public;

                data["fundValue"] = 0;

                data["accessCode"] = Array.from({length: 6},
                    () => randomInt(10)).join('');

                data["memberRequests"] = [];
                
                data["fundDisbursementPeriod"] = disbursementPeriod;

                data["disbursementType"] = disbursementType;
                
                data["dateCreated"] = Date.now();

                data["availableBalance"] = 0;

                data["withdrawableFunds"] = 0;
                
                //data["securitiesPositionID"] = 

                //data["ordersID"] = ;
            }

            await db.connect(async (db) => {
                try {
                    await db.collection('FundPortfolios').insertOne(data);
                    res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: 'fund successfully created', data: {}});
                } catch(e) {
                    res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'});
                }
            });
        } catch(e) {z
            res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'});
        }
    }
}