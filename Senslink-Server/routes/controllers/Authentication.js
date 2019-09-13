const routes = require('express').Router();
const mail = require('../../mail/mail');
const pool = require('../../mysql/mysql');
const bcrypt = require('bcrypt');


const filterUserKeys = ({id, name, surname, username, email, level, tel}) => ({
    id, name, surname, username, email, level, tel
})

routes.post('/login', async (req, res) => {
    try {
        const query_result = await pool.query(
            'SELECT * FROM user WHERE username = ?', [req.body.username]
        );

        if (Array.isArray(query_result) && query_result.length === 1) {
            const user_credentials = query_result.shift();

            const is_authorized = await bcrypt.compare(req.body.password, user_credentials.password);

            if (is_authorized) {
                return res.status(200).send(filterUserKeys(user_credentials));
            } else {
                return res.sendStatus(500);
            }
        } else {
            return res.sendStatus(500);
        }
    }
    catch (status_code) {
        return res.sendStatus(status_code);
    }
});


module.exports = routes;