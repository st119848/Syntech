const routes = require('express').Router();
const pool = require('../../mysql/mysql');
const moment = require('moment');

const convertTime = (time, hr) => {
    return moment(time).format('YYYY-MM-DD HH:mm:ss');
}

routes.post('/get', async (req, res) => {
    let QUERY = 'SELECT * FROM monitor';

    if (req.body.station !== '') {
        QUERY += ` WHERE station = '${req.body.station}'`
    }
    if (req.body.from !== '') {
        QUERY += ` AND timestamp >= '${req.body.from}'`
    }
    if (req.body.to !== '') {
        QUERY += ` AND timestamp <= '${req.body.to}'`
    }

    await pool.query(QUERY, (err, query_result) => {
        if (err) return res.sendStatus(500);

        let result = [];
        for (let i = 0, len = query_result.length; i < len; i++) {
            let each = Object.values(query_result[i]);

            result.push({
                metas: each.slice(1, 3), // [timestamp, station_name]
                measures: each.slice(3, 8).map(o => Number(o)) // [water, battery, solar, temp, signal]
            })
        }
        
        return res.status(200).send(result);
    })
});

routes.post('/chart', async (req, res) => {
    const stations = JSON.parse(req.body.stations);
    
    let QUERY = `SELECT * FROM monitor WHERE `;

    QUERY += '(';
    stations.forEach(station => {
        QUERY += `station = '${station}' OR `;
    })
    QUERY = QUERY.substring(0, QUERY.length - 4);
    QUERY += ')';

    if (req.body.from !== '') {
        QUERY += ` AND timestamp >= '${req.body.from}'`
    }
    if (req.body.to !== '') {
        QUERY += ` AND timestamp <= '${req.body.to}'`
    }


    await pool.query(QUERY, (err, query_result) => {
        if (err) return res.sendStatus(500);

        let result = [];
        for (let i = 0, len = query_result.length; i < len; i++) {
            let each = Object.values(query_result[i]);
            const [, timestamp, station, ...measures] = each;

            result.push({
                metas: [convertTime(timestamp, 7), station], // [timestamp, station_name]
                measures: measures // [water, battery, solar, temp, signal]
            })
        }
        
        return res.status(200).send(result);
    })
});

routes.get('/:selected_date', async (req, res) => {
    let QUERY = `SELECT * FROM monitor WHERE DATE(timestamp) = ?`;

    await pool.query(QUERY, [req.params.selected_date], (err, query_result) => {
        if (err) return res.sendStatus(500);

        let result = [];
        for (let i = 0, len = query_result.length; i < len; i++) {
            let each = Object.values(query_result[i]);
            const [, timestamp, station, ...measures] = each;

            result.push({
                metas: [convertTime(timestamp, 7), station], // [timestamp, station_name]
                measures: measures // [water, battery, solar, temp, signal]
            })
        }
        
        return res.status(200).send(result);
    })
});

module.exports = routes;