const pool = require('../mysql');

module.exports = {
    QueryGateIDs: function() {
        const sql = `SELECT * FROM gate`;

        return new Promise((resolve, reject) => {
            pool.query(sql, (err, result) => {
                if (err) reject(err);
                
                resolve(result);
            });
        })
    },
}