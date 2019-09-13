const pool = require('../mysql');

module.exports = {
    UpdateMonitor: (payload) => {
        const sql = `UPDATE monitor SET station = ? WHERE station = ?`;

        return new Promise((resolve, reject) => {
            pool.query(sql, [...payload], (err, OkPacket) => {
                if (err) reject(err);

                resolve(OkPacket);
            });
        })
    },
}