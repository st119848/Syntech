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
rule.minute = 10; // every day (hour = 0)

schedule.scheduleJob(rule, async () => { 
    /**
     * Get all stations id from redis
     */
    const stations = JSON.parse(await cache.get('stationids'));
    if (!Array.isArray(stations) || stations.length === 0) return;

    await asyncForEach(stations, async (station) => {
        let cur_time_iso = moment().tz('Asia/Bangkok').format('YYYY-MM-DDTHH.mm.ss');
        let pre_time_iso = moment().tz('Asia/Bangkok').subtract(1, 'days').format('YYYY-MM-DDTHH.mm.ss');

        // console.log(cur_time_iso)
        // console.log(pre_time_iso)

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

        let itr_timestamp  = pre_time_iso.split('.').join(':');
        
        for (let i = 0; i < 288; i++) {
            console.log(itr_timestamp)

            itr_timestamp = moment(itr_timestamp).add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        }
        
        
    }); // end forEach
});

