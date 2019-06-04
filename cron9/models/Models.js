module.exports = function (mongoose) {
    return {
        cronjobs: require('./CronJob'),
        logs: require('./Logs')
    };
}