const routes = require('express').Router();
const pool = require('../../mysql/mysql')

routes.get('/user', async (req, res) => {
    try {
        const all_users = await pool.query('SELECT * FROM user');

        const filterUserKeys = ({id, name, surname, department, level, username, email, tel}) => ({
            id, name, surname, department, level, username, email, tel
        });

        return res.status(200).send(all_users.map(each => filterUserKeys(each)));
    }
    catch (err) {
        return res.sendStatus(500);
    }
});



routes.get('/station', async (req, res) => {
    try {
        const all_stations = await pool.query('SELECT * FROM station');

        const parseData = (obj) => {
            obj.coordinates = JSON.parse('[' + obj.coordinates + ']');
            obj.thresholds = JSON.parse('[' + obj.thresholds + ']');
            return obj;
        }

        return res.status(200).send(all_stations.map(each => parseData(each)));
    }
    catch (err) {
        return res.sendStatus(500);
    }
});

routes.get('/gate', async (req, res) => {
    try {
        const all_gates = await pool.query('SELECT * FROM gate');

        const parseData = (obj) => {
            obj.coordinates = JSON.parse('[' + obj.coordinates + ']');
            return obj;
        }

        return res.status(200).send(all_gates.map(each => parseData(each)));
    }
    catch (err) {
        return res.sendStatus(500);
    }
});

module.exports = routes;