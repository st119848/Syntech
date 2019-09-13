const pool = require('../mysql');

module.exports = {
    LogAction: (payload) => {
        const sql = `INSERT INTO action (timestamp, fullname, station, gate, m_before, m_after) 
                    VALUES (?, ?, ?, ?, ?, ?)`;

        return new Promise((resolve, reject) => {
            pool.query(sql, [...payload], (err, OkPacket) => {
                if (err) reject(err);

                resolve(OkPacket);
            });
        })
    },
}