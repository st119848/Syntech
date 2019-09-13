const cache = require('./cache');
const {QueryStationIDs} = require('../mysql/models/Monitor');

module.exports = {
    UpdateStationIDCache: async () => {
        const stationids = await QueryStationIDs();

        return new Promise((resolve, reject) => {
            cache.set('stationids', JSON.stringify(stationids), (err, reply) => {
                if (err) reject(err);

                resolve(reply);
            });
        })
    },
}