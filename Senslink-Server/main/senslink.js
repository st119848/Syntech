const schedule = require('node-schedule');
const moment = require('moment-timezone');

const Auth = require('../services/token').AuthToken;
const Senslink = require("../services/senslink").GetApiData;
const io = require('../services/streams/streams');

const cache = require('../cache/cache');

const {
    handle,
    asyncForEach,
    formatTimestamp
} = require("../helpers/helpers");

const rule = new schedule.RecurrenceRule();
rule.second = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]; // every 5 second

schedule.scheduleJob(rule, async () => {
  /**
   * Get all stations id from redis
   */
  const stations = JSON.parse(await cache.get('stationids'));
  // console.log(await cache.get('stationids'))
  if (!Array.isArray(stations) || stations.length === 0) {
    io.emit('stations', []);
    return;
  };

  let result = [];
  await asyncForEach(stations, async (station) => {
    /**
     * Get authentication token
     */
    const [token_err, token] = await handle(Auth());
    if (token_err || !token) return;

    const [senslink_err, senslink] = await handle(
      Promise.all([
        Senslink(`/LatestData/Read/PhysicalQuantity/${station.water_id}`, token),
        Senslink(`/LatestData/Read/PhysicalQuantity/${station.battery_id}`, token),
        Senslink(`/LatestData/Read/PhysicalQuantity/${station.solar_id}`, token),
        Senslink(`/LatestData/Read/PhysicalQuantity/${station.temp_id}`, token),
        Senslink(`/LatestData/Read/PhysicalQuantity/${station.signal_id}`, token)
      ])
    );
    if (senslink_err || !Array.isArray(senslink) || !senslink.length > 0) return;
    
    const measures = senslink.map(
      each => isNaN(each.Value) ? 0 : Number(each.Value.toFixed(2))
    );

    result.push({
      station_name: station.station,
      location: JSON.parse('[' + station.coordinates + ']'),
      measures: measures,
      thresholds: JSON.parse('[' + station.thresholds + ']'),
      updated: formatTimestamp(senslink[0].TimeStamp),
      created: moment().tz('Asia/Bangkok').format('HH:mm:ss')
    });
  }); // end forEach

  if (Array.isArray(result) && result.length > 0) {
    io.emit('stations', result);
  };
})

