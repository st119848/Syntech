const cache = require('./cache');
const {QueryGateIDs} = require('../mysql/models/Controller');

module.exports = {
    UpdateGateIDCache: async () => {
        const gateids = await QueryGateIDs();

        return new Promise((resolve, reject) => {
            cache.set('gateids', JSON.stringify(gateids), (err, reply) => {
                if (err) reject(err);

                resolve(reply);
            });
        })
    },
}