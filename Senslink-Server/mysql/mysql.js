const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "skbuengf",
    database: "cweir"
});

// Ping database to check for common exception errors.
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
    }

    if (connection) {
        pool.query("SELECT * FROM information_schema.tables WHERE table_schema='cweir' AND table_name='monitor' LIMIT 1", (_, result) => {
            if (result.length === 0) {
                const sql = `CREATE TABLE monitor (
                            id INT AUTO_INCREMENT PRIMARY KEY, 
                            timestamp DATETIME, 
                            station VARCHAR(24),
                            m_water VARCHAR(6), 
                            m_battery VARCHAR(6), 
                            m_solar VARCHAR(6), 
                            m_temp VARCHAR(6), 
                            m_signal VARCHAR(6))`
                pool.query(sql, (err) => {
                    if (err) {
                        console.log("Table monitor is not created!");
                    } else {
                        console.log("Table monitor is created!");
                    };
                });
            }
        }); 

        pool.query("SELECT * FROM information_schema.tables WHERE table_schema='cweir' AND table_name='controller' LIMIT 1", (_, result) => {
            if (result.length === 0) {
                const sql = `CREATE TABLE controller (
                            id INT AUTO_INCREMENT PRIMARY KEY, 
                            timestamp DATETIME, 
                            station VARCHAR(24),
                            m_levels VARCHAR(30), 
                            m_sensors VARCHAR(30), 
                            m_overloads VARCHAR(30), 
                            m_amount VARCHAR(30))`
                pool.query(sql, (err) => {
                    if (err) {
                        console.log(err)
                        console.log("Table controller is not created!");
                    } else {
                        console.log("Table controller is created!");
                    };
                });
            }
        });

        pool.query("SELECT * FROM information_schema.tables WHERE table_schema='cweir' AND table_name='user' LIMIT 1", (_, result) => {
            if (result.length === 0) {
                const sql = `CREATE TABLE user (
                            id INT AUTO_INCREMENT PRIMARY KEY, 
                            name VARCHAR(24),
                            surname VARCHAR(32), 
                            department VARCHAR(32), 
                            level VARCHAR(10), 
                            username VARCHAR(24) UNIQUE,
                            password VARCHAR(256),
                            email VARCHAR(32),
                            tel VARCHAR(12))`
                pool.query(sql, (err) => {
                    if (err) {
                        console.log("Table user is not created!");
                    } else {
                        console.log("Table user is created!");
                    };
                });
            }
        });

        pool.query("SELECT * FROM information_schema.tables WHERE table_schema='cweir' AND table_name='station' LIMIT 1", (_, result) => {
            if (result.length === 0) {
                const sql = `CREATE TABLE station (
                            id INT AUTO_INCREMENT PRIMARY KEY, 
                            station VARCHAR(36) UNIQUE,
                            coordinates VARCHAR(24), 
                            address VARCHAR(42), 
                            log_interval INT, 
                            thresholds VARCHAR(36), 
                            water_id VARCHAR(36),
                            battery_id VARCHAR(36),
                            solar_id VARCHAR(36),
                            temp_id VARCHAR(36),
                            signal_id VARCHAR(36))`
                pool.query(sql, (err) => {
                    if (err) {
                        console.log("Table station is not created!");
                    } else {
                        console.log("Table station is created!");
                    };
                });
            }
        });

        pool.query("SELECT * FROM information_schema.tables WHERE table_schema='cweir' AND table_name='gate' LIMIT 1", (_, result) => {
            if (result.length === 0) {
                const sql = `CREATE TABLE gate (
                            id INT AUTO_INCREMENT PRIMARY KEY, 
                            station VARCHAR(36) UNIQUE,
                            coordinates VARCHAR(24), 
                            address VARCHAR(42), 
                            log_interval INT, 
                            amount INT, 
                            max_level INT,
                            ip VARCHAR(15),
                            port VARCHAR(4))`
                pool.query(sql, (err) => {
                    if (err) {
                        console.log("Table gate is not created!");
                    } else {
                        console.log("Table gate is created!");
                    };
                });
            }
        });

        pool.query("SELECT * FROM information_schema.tables WHERE table_schema='cweir' AND table_name='action' LIMIT 1", (_, result) => {
            if (result.length === 0) {
                const sql = `CREATE TABLE action (
                            id INT AUTO_INCREMENT PRIMARY KEY, 
                            timestamp DATETIME, 
                            fullname VARCHAR(46), 
                            station VARCHAR(36),
                            gate INT, 
                            m_before INT, 
                            m_after INT)`
                pool.query(sql, (err) => {
                    if (err) {
                        console.log("Table action is not created!");
                    } else {
                        console.log("Table action is created!");
                    };
                });
            }
        });

        connection.release();
    }

    return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;