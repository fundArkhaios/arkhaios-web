const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    defaultMeta: { service: 'server' },
    transports: [
        new winston.transports.File({ filename: 'server.log'})
    ]
});

module.exports = {
    log: logger.log,
    logger: logger,
}