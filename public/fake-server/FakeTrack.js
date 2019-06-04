var cheerio = require('cheerio');
var fs = require('fs');

var socketIO = null;
var dirName = 'gpx/';

var trackingState = {};

function emitRoute(routeName, routeNodes, currentIndex, driverIndex) {

    if(routeNodes[currentIndex]) {
        trackingState = Object.assign(trackingState, {
            Latitude: routeNodes[currentIndex].lat,
            Longitude: routeNodes[currentIndex].lng,
            DriverId: "driver"+driverIndex,
            Speed: 0.0,
            Bearing: currentIndex > 0 ? _calculateBearing({Latitude: routeNodes[currentIndex].lat,Longitude: routeNodes[currentIndex].lng},{Latitude: routeNodes[currentIndex-1].lat,Longitude: routeNodes[currentIndex-1].lng}) : 0,
            Timestamp: Date.now(),
            Accuracy: 20,
            TenantId: driverIndex > 7 ? '301FD400-A0FC-496F-A630-BCB6A6DD5BE7': '50F56597-C049-E611-80C7-14187728D133'
        });

        socketIO.emit('LOCATIONUPDATED', trackingState);
    }

    const sleepTime = 4000;

    return setTimeout(function () {
        emitRoute(routeName, routeNodes, ++currentIndex,driverIndex);
    }, sleepTime);
}

function run(io,index) {

    socketIO = io;

    fs.readdir(dirName, function (err, filenames) {
        if (err) {
            console.log(err);
            return;
        }

        var filename = filenames[index-1];
        const fileExtension = filename.split('.').pop()
        if (fileExtension !== 'gpx') return;

        console.log('Parsing file: ' + dirName + filename);

        fs.readFile(dirName + filename, 'utf-8', function (err, content) {
            if (err) {
                console.log(err);
                return;
            }

            const $ = cheerio.load(content, {
                normalizeWhitespace: true,
                xmlMode: true
            });

            const routeNodes = $('trkpt').map((i, node) => ({
                lat: Number($(node).attr('lat')),
                lng: Number($(node).attr('lon'))
            })).get();

            // Emit route to client
            if (routeNodes.length > 0) {
                emitRoute(filename, routeNodes, 0, index);
            }
        });
    });
}

function _calculateBearing(pointB,pointA) {
    var dLon = (pointB.Longitude - pointA.Longitude);
    var lat1 = (pointA.Latitude);
    var lat2 = (pointB.Latitude);
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    var bearing = _toDeg(Math.atan2(y, x));
    bearing = ((bearing + 360) % 360).toFixed(1);
    return bearing;
}

function _toDeg(rad) {
    return rad * 180 / Math.PI;
}


module.exports.run = run;