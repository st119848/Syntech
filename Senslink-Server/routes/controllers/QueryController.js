const routes = require('express').Router();
const pool = require('../../mysql/mysql');

routes.post('/get', async (req, res) => {
    let QUERY = 'SELECT * FROM controller';

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
                metas: each.slice(1, 3), // [timestamp, station]
                measures: each.slice(4, 6).map(o => JSON.parse('[' + o + ']')) // [sensors, overloads]
            })
        }
        console.log(result)
        
        return res.status(200).send(result);
    })
});

module.exports = routes;