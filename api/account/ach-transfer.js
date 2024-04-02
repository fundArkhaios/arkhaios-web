const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type.js')
const alpaca = require('../external/alpaca/api.js');
const db = require('../../util/db.js');
const logger = require('../../util/logger.js');
const { backward } = require('../aes.js');

module.exports = {
    route: '/api/account/ach-transfer',
    kyc: true,
    post: async function(req, res, user) {
        if(!req.body.institution) {
            return res.status(401).send({
                status: RESPONSE_TYPE.FAILED,
                message: 'invalid institution',
                data: {}
            });
        } else if(req.body.type != 'checking' && req.body.type != 'savings') {
            return res.status(401).send({
                status: RESPONSE_TYPE.FAILED,
                message: 'expected checking or savings account',
                data: {}
            });
        } else if(req.body.direction != 'incoming' && req.body.direction != 'outgoing') {
            return res.status(401).send({
                status: RESPONSE_TYPE.FAILED,
                message: 'expected incoming or outgoing direction',
                data: {}
            });
        } else {
            const { response, status } = await alpaca.get_ach_relationships(user.brokerageID);

            if(status == 200) {
                const relationship = response[0];
                if(relationship?.id) {
                    const { response, status } = await alpaca.delete_ach_relationship(user.brokerageID, relationship.id);
                    if(status != 200) {
                        return SERVER_ERROR(res);
                    }
                }

                let token = null;

                await db.connect(async (db) => {
                    try {
                        let banks = await db.collection('Banks').findOne({accountID: user.accountID});

                        if(banks?.processor_tokens?.[req.body.institution]) {
                            token = await backward(banks.processor_tokens[req.body.institution]);
                        }
                    } catch(e) {
                        logger.log({
                            level: 'error',
                            message: e
                        })
                    }
                });

                if(!token) {
                    SERVER_ERROR(res);
                } else {
                    const { response, status } = await alpaca.create_ach_relationship(user.brokerageID, {
                        processor_token: token,
                        bank_account_type: req.body.type.toUpperCase()
                    });

                    if(status == 200) {
                        const relationship = response.id;
                        if(relationship) {
                            const { response, status } = await alpaca.create_transfer(user.brokerageID, {
                                transfer_type: "ach",
                                relationship_id: relationship,
                                amount: req.body.amount,
                                direction: req.body.direction.toUpperCase(),
                                timing: "immediate"
                            });

                            if(status == 200) {
                                res.status(200).send({
                                    status: RESPONSE_TYPE.SUCCESS,
                                    message: 'transfer completed',
                                    data: response
                                });
                            } else {
                                return SERVER_ERROR(res);
                            }
                        }
                    } else {
                        return SERVER_ERROR(res);
                    }
                }
            } else {
                SERVER_ERROR(res)
            }
        }
    }
}