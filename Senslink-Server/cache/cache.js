const {QueryStationIDs} = require('../mysql/models/Monitor');
const {QueryGateIDs} = require('../mysql/models/Controller');

const util = require('util');
const redis = require('redis')
const cache = redis.createClient('6379', '127.0.0.1');

cache.get = util.promisify(cache.get);
// cache.set = util.promisify(cache.set);

cache.on('connect', async () => {
    console.log('Redis is ready!');

    const stationids = await QueryStationIDs();

    cache.set('stationids', JSON.stringify(stationids), (err) => {
        if (!err) {
            console.log('StatiodIDs are loaded!');
        } else {
            console.log('StatiodIDs are not loaded!');
        }
    });

    const gateids = await QueryGateIDs();

    cache.set('gateids', JSON.stringify(gateids), (err) => {
        if (!err) {
            console.log('GateIDs are loaded!');
        } else {
            console.log('GateIDs are not loaded!');
        }
    });
});
 
module.exports = cache;