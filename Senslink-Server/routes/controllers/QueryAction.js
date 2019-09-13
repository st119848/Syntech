const routes = require('express').Router();
const pool = require('../../mysql/mysql');

routes.get('/get', async (req, res) => {
    let QUERY = 'SELECT * FROM action';
 
    await pool.query(QUERY, (err, query_result) => {
        if (err) return res.sendStatus(500);
        
        return res.status(200).send(query_result);
    })
});

module.exports = routes;