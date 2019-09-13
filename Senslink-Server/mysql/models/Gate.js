const pool = require('../mysql');

module.exports = {
    CreateGate: async (payload) => {
        const sql = `INSERT INTO gate (station, coordinates, log_interval, amount, max_level, ip, port)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;

        return new Promise((resolve, reject) => {
            pool.query(sql, [...payload], (err, OkPacket) => {
                if (err) reject(err);

                resolve(OkPacket);
            });
        })
    },

    EditGate: async (payload, id) => {
        const sql = `UPDATE gate SET station = ?, coordinates = ?, log_interval = ?, 
                    amount = ?, max_level = ?, ip = ?, port = ? WHERE id = ?`;
                    
        return new Promise((resolve, reject) => {
            pool.query(sql, [...payload, id], (err, OkPacket) => {
                if (err) reject(err);

                resolve(OkPacket);
            });
        })
    },

    DeleteGate: async (id) => {
        const sql = `DELETE FROM gate WHERE id = ?`;

        return new Promise((resolve, reject) => {
            pool.query(sql, [id], (err, OkPacket) => {
                if (err) reject(err);

                resolve(OkPacket);
            });
        })
    },
}