const pool = require('../mysql');

module.exports = {
    LogController: (payload) => {
        const sql = `INSERT INTO controller (timestamp, station, m_levels, m_sensors, m_overloads, m_amount) 
                    VALUES (?, ?, ?, ?, ?, ?)`;

        return new Promise((resolve, reject) => {
            pool.query(sql, [...payload], (err, OkPacket) => {
                if (err) reject(err);

                resolve(OkPacket);
            });
        })
    },
}