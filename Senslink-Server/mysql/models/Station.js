const pool = require('../mysql');

module.exports = {
    CreateStation: async (payload) => {
        const sql = `INSERT INTO station (station, coordinates, address, log_interval, thresholds, 
                    water_id, battery_id, solar_id, temp_id, signal_id) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        return new Promise((resolve, reject) => {
            pool.query(sql, [...payload], (err, OkPacket) => {
                if (err) reject(err);

                resolve(OkPacket);
            });
        })
    },

    EditStation: async (payload, id) => {
        const sql = `UPDATE station SET station = ?, coordinates = ?, address = ?, log_interval = ?, thresholds = ?,
                    water_id = ?, battery_id = ?, solar_id = ?, temp_id = ?, signal_id = ? WHERE id = ?`;
                    
        return new Promise((resolve, reject) => {
            pool.query(sql, [...payload, id], (err, OkPacket) => {
                if (err) reject(err);

                resolve(OkPacket);
            });
        })
    },

    DeleteStation: async (id) => {
        const sql = `DELETE FROM station WHERE id = ?`;

        return new Promise((resolve, reject) => {
            pool.query(sql, [id], (err, OkPacket) => {
                if (err) reject(err);

                resolve(OkPacket);
            });
        })
    },
}