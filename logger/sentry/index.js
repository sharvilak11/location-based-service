var Raven = require('raven');
Raven.config(process.env.SENTRY_URL, {
	captureUnhandledRejections: true,
	autoBreadcrumbs: true
}).install();

module.exports = function (app) {
	return {
		setupSentry: function setupSentry() {
			console.log("Sentry Initialised");
			//Setup generic raven Error Handler for unhandled exception
			app.use(Raven.errorHandler());

			//Set Raven User Context on All Requests
			app.all('*', function (req, res, next) {
				Raven.mergeContext({
					user: {
						IP: req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null)
					}
				});
				next();
			});
		},
		logError: function logError(errorText, exc) {
			Raven.captureException(exc, {
				message: errorText,
				level: 'error'
			});
		},
		logWarning: function logWarning(warningText) {
			Raven.captureMessage(warningText, {
				level: 'warning'
			});
		},
		logDebug: function logDebug(debugText) {
			Raven.captureMessage(debugText, {
				level: 'debug'
			});
		}
	}
}
