//Import Componets
var express = require('express');
var bodyParser = require('body-parser'); // middleware
var cors = require('cors');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var path=require('path');
// var auth = require('auth');

var startUpJobs = require('./cron9/startup/StartUpJobs');

// Setup Environment
require('dotenv').config();
require('./cron9/jobs/index');

// Setup App
var app = express();
var port = process.env.PORT;
var jobApp = express();
var jobPort = process.env.JOBPORT;

var logger = require('./logger')(app);

// Configure App
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '16kb'
}));
app.use(bodyParser.json({
    limit: '16kb'
}));
app.use(cors());

jobApp.use(bodyParser.json({
    limit: '50mb'
}));
jobApp.use(bodyParser.urlencoded({
    extended: true
}));

jobApp.use(methodOverride('X-HTTP-Method-Override'));

jobApp.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

jobApp.use(express.static(path.join(__dirname,'cron9/public')));

app.listen(port, function () {
    console.log("App initiated at port " + port);
});

jobApp.listen(jobPort,function(){
    console.log('Jobs started at PORT '+jobPort);
});

startUpJobs();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true
});

if(process.env.TEST == 1) {
    require('./public/fake-server');
}

var {io,redisClient} = require('./socketio')(logger);

require('./routes/LocationRoutes')(app,io,redisClient);
require('./routes/TripRoutes')(app,io,redisClient);
require('./routes/DriverRoutes')(app,io,redisClient);

var jobModels = require('./cron9/models/Models')(mongoose);
require('./cron9/routes/UserRoutes')(jobApp);
require('./cron9/routes/ApiRoutesJobs')(jobApp,jobModels);

exports = module.exports = app;