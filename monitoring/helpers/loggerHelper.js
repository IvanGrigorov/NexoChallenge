const { pino } = require('pino');
const logger = pino({
    level: process.env.PINO_LOG_LEVEL || 'debug',
    timestamp: pino.stdTimeFunctions.isoTime,
});

function log(messagae) {
   logger.info(messagae);
}

function logError(messagae) {
   logger.error(messagae);
}

module.exports = {
    log,
    logError
}