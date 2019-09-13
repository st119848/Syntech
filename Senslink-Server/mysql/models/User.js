const pool = require('../mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    CreateUser: async (payload, password) => {
        const sql = `INSERT INTO user 
                    (name, surname, department, level, username, email, tel, password) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) reject(err);

                pool.query(sql, [...payload, hash], (err, OkPacket) => {
                    if (err) reject(err);

                    resolve(OkPacket);
                });
            });
        })
    },

    EditUser: async (payload, id, password) => {
        if (password) {
            const sql = `UPDATE user SET name = ?, surname = ?, department = ?, level = ?, 
                        username = ?, email = ?, tel = ?, password = ? WHERE id = ?`;

            return new Promise((resolve, reject) => {
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err) reject(err);
    
                    pool.query(sql, [...payload, hash, id], (err, OkPacket) => {
                        if (err) reject(err);
    
                        resolve(OkPacket);
                    });
                });
            })
        } else {
            const sql = `UPDATE user SET name = ?, surname = ?, department = ?, level = ?, 
                        username = ?, email = ?, tel = ? WHERE id = ?`;

            return new Promise((resolve, reject) => {
                pool.query(sql, [...payload, id], (err, OkPacket) => {
                    if (err) reject(err);
                    
                    resolve(OkPacket);
                });
            })
        }
    },

    DeleteUser: async (id) => {
        const sql = `DELETE FROM user WHERE id = ?`;

        return new Promise((resolve, reject) => {
            pool.query(sql, [id], (err, OkPacket) => {
                if (err) reject(err);

                resolve(OkPacket);
            });
        })
    },
}