module.exports = function (app) {

	var _sentry = require("./sentry")(app);

	//SETUP LOGGER
	switch (process.env.CURRENT_LOGGER) {
		case 'SENTRY':
			_sentry.setupSentry();
			break;
	}

	return {
		logError: function logError(errorText, exc) {
			switch (process.env.CURRENT_LOGGER) {
				case 'SENTRY':
					_sentry.logError(errorText, exc);
					break;
				default:
					console.log("Error: " + errorText);
			}

		},

		logWarning: function logWarning(warningText) {
			switch (process.env.CURRENT_LOGGER) {
				case 'SENTRY':
					_sentry.logWarning(warningText);
					break;
				default:
					console.log("Warning: " + warningText);
			}

		},

		logDebug: function logDebug(debugText) {
			switch (process.env.CURRENT_LOGGER) {
				case 'SENTRY':
					_sentry.logDebug(debugText);
					break;
				default:
					console.log("Info: " + debugText);
			}

		}
	}
}
