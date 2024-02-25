const RESPONSE_TYPE = {
    SUCCESS: 'success',
    FAILED: 'failed',
    ERROR: 'error'
};

module.exports = {
    RESPONSE_TYPE: RESPONSE_TYPE,
    SERVER_ERROR: function(res) {
        res.status(501).send({status: RESPONSE_TYPE.ERROR, message: "server error"});
    }
}