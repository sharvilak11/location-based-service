## Location Based Service ##

****Set up config.js****
 
Copy in root project folder

```$xslt
module.exports = {
    filters: {
            kalman: {
                constant: 500
            },
            discard: {
                distance: 20,
                bearing: 20
            },
            simplify: {
                tolerance: 4
            }
        },
        google_map: {
            directions: {
                api: 'https://maps.googleapis.com/maps/api/directions/json?mode=driving'
            },
            key: '<google_key>'
        },
        redis: {
            host: '<redis_host>',
            port: <redis_port>,
            password: '<redis_password>'
        }
};
```
- You can set your kalman constant and discard threshold as per your own configurations.
- All the locations having less than distance of 20 or less than bearing difference of 20 than last location will be discarded. This is the part of basic filtering which is done at the start before applying any other filters
- simplify.tolerance property will define the tolerance constant when applying radial distance and raemer douglas peucker algorithm.

Copy .env file

```$xslt
PORT=8081
SOCKET_PORT=9999
FAKE_SOCKET_PORT=9998
DATABASE=<mongodb_urlstring>
TEST=1
```

****Information****

- This project used Nodejs, MongoDB, Socketio and Redis in order to make live tracking experience seamless at the user's end and brings out optimal performance at the server end.

****Role of Redis****
- Redis is being used in order to store locations of drivers/users in sorted hashsets (special redis datatype) which makes it really fast to sort locations based on their timestamps. All the locations are stored in memory till the trip is in progress.

****Internal Functions****
- As soon as the trip ends, the locations are taken from Redis, processed in Nodejs environment applying advanced alogorithms - [Raemer Douglas Peucker](https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm), [Simplify-JS](https://mourner.github.io/simplify-js/), [Kalman filter](https://en.wikipedia.org/wiki/Kalman_filter), [Radial Distance](http://psimpl.sourceforge.net/radial-distance.html) and other speed level basic filters and locations are stored into Mongodb. On an average based on observations, these algorithms **reduces down from 500 locations to just 40 locations** (although) this is based on exactly the curvature of the path driver has taken.
- Once all the locations are stored into Mongodb and encoded route is generated, redis sorted set is cleared for that particular driver and its trip.

****Role of SocketIO****
- Sockets make it really **easy and lightweight** for locations to be transmitted between client, server and driver. The size of the payload sent along with authentication headers is maximum 90 bytes. Rooms are created based on trip between customer and driver. A Global level room is created between the owner/admin of the company and all drivers

****Fake server****
- Fake server runs like driver apps emitting locations every 4 seconds (for a particular driver) when in 'Live' mode. In idle mode it sends sockets containing locations of all drivers to the dispatch page every 20 seconds. Feel free to connect to any other device and turn this fake server off by changing env variable TEST to 0.
- Start the node server - server.js
- Open the application on same port in browser. Start driverapps first and then start customer apps and dispatch pages and BOOM !

****Role of Cron****
- Cron runs and periodically checks whether driver are sending locations or not. If the certain threshold is bypassed, cron sets the driver's shifts to offline and processes all the locations exist in Redis for that particular driver's sorted set, adds the processed locations to mongodb and clears up Redis.

****utm version of SimplifyJS****
- Simplify-JS is only available for cartesian co-ordinates. You can check **douglas-peucker.js** file under filters/simplify-js where I have proposed my own version to get co-ordinates of a place since world isn't completely round we need to get square distance from a point to a segment. Check https://en.wikipedia.org/wiki/Easting_and_northing for more details.
- I have used npm package [utm-latlng](https://www.npmjs.com/package/utm-latlng) in order to get easting and northing of any location at any particular segment.
