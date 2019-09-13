const interval = require('interval-promise');
const moment = require('moment-timezone');
const schedule = require('node-schedule');
const Auth = require('../services/token').AuthToken;
const Senslink = require("../services/senslink").GetApiData;

const cache = require('../cache/cache');
const {LogMonitor} = require('../mysql/models/LogMonitor');

const {
    handle,
    asyncForEach
} = require("../helpers/helpers");

const parseDigit = (num) => {
    return !isNaN(num)
        ? parseFloat(num).toFixed(2)
        : 'NaN'
}

const rule = new schedule.RecurrenceRule();
rule.minute = 0; // every hour (minute = 0)

schedule.scheduleJob(rule, async () => { 
    /**
     * Get all stations id from redis
     */
    const stations = JSON.parse(await cache.get('stationids'));
    if (!Array.isArray(stations) || stations.length === 0) return;

    await asyncForEach(stations, async (station) => {
        let cur_time_iso = moment().tz('Asia/Bangkok').format('YYYY-MM-DDTHH.mm.ss');
        let pre_time_iso = moment().tz('Asia/Bangkok').subtract(1, 'hours').format('YYYY-MM-DDTHH.mm.ss');

        /**
         * Get authentication token
         */
        const [token_err, token] = await handle(
            Auth(station.client_id, station.client_secret)
        );
        if (token_err || !token) return;

        const [senslink_err, senslink] = await handle(
            Promise.all([
                Senslink(`/TimeSeriesData/ReadAggregatedData/${station.water_id}/${pre_time_iso}/${cur_time_iso}/1/300/420`, token),
                Senslink(`/TimeSeriesData/ReadAggregatedData/${station.battery_id}/${pre_time_iso}/${cur_time_iso}/1/300/420`, token),
                Senslink(`/TimeSeriesData/ReadAggregatedData/${station.solar_id}/${pre_time_iso}/${cur_time_iso}/1/300/420`, token),
                Senslink(`/TimeSeriesData/ReadAggregatedData/${station.temp_id}/${pre_time_iso}/${cur_time_iso}/1/300/420`, token),
                Senslink(`/TimeSeriesData/ReadAggregatedData/${station.signal_id}/${pre_time_iso}/${cur_time_iso}/1/300/420`, token)
            ])
        );
        if (senslink_err || !Array.isArray(senslink) || senslink.length !== 5) return;

        let [water, battery, solar, temp, signal] = senslink.map(
            each => each.Values.map(_each => parseDigit(_each))
        );

        let itr_timestamp = pre_time_iso.split('.').join(':');
        // let itr_timestamp = moment(pre_time_iso.split('.').join(':')).add(7, 'hours').format('YYYY-MM-DD HH:mm:00');
        
        for (let i = 0; i < 12; i++) {
            await LogMonitor([
                itr_timestamp,
                station.station,
                water[i],
                battery[i],
                solar[i],
                temp[i],
                signal[i]
            ]).catch(() => console.log("Error logging monitor."))

            itr_timestamp = moment(itr_timestamp).add(5, 'minutes').format('YYYY-MM-DD HH:mm:00');
        }
    }); // end forEach
});

