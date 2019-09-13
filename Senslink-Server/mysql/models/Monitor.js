const pool = require('../mysql');

module.exports = {
    QueryStationIDs: function() {
        const sql = `SELECT * FROM station`;

        return new Promise((resolve, reject) => {
            pool.query(sql, (err, result) => {
                if (err) reject(err);
                
                resolve(result);
            });
        })
    },
}