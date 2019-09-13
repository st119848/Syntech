const pool = require('../mysql');

module.exports = {
    LogMonitor: (payload) => {
        const sql = `INSERT INTO monitor (timestamp, station, m_water, m_battery, m_solar, m_temp, m_signal) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;

        return new Promise((resolve, reject) => {
            pool.query(sql, [...payload], (err, OkPacket) => {
                if (err) reject(err);

                resolve(OkPacket);
            });
        })
    },
}