const routes = require('express').Router();
const mail = require('../../../mail/mail')
const Joi = require('@hapi/joi');

const {
    CreateUser, EditUser, DeleteUser
} = require('../../../mysql/models/User');

const schema = Joi.object().keys({
    name: Joi.string().required(),
    surname: Joi.string().required(),
    department: Joi.string().required(),
    level: Joi.string().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).allow(''),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    tel: Joi.string().min(9).max(12).required()
})

routes.route('/')
    .post((req, res, next) => {
        const raw_form = {
            name: req.body.name,
            surname: req.body.surname,
            department: req.body.department,
            level: req.body.level,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            tel: req.body.tel
        }

        Joi.validate(raw_form, schema, async (error, valid_form) => {
            if (error) return res.sendStatus(500);

            const password = valid_form.password;
            delete valid_form['password'];

            try {
                const OkPacket = await CreateUser([...Object.values(valid_form)], password);

                mail.sendMail({
                    to: req.body.email,
                    subject: 'Created Account',
                    body: '1wqewq'
                });

                if (OkPacket) {
                    return res.status(200).send({
                        id: Number(OkPacket.insertId),
                        ...valid_form
                    })
                } else return res.sendStatus(500);
            } catch (e) {
                console.log(e)
                return res.sendStatus(500);
            }
        });
    })
    .put(async (req, res, next) => {     
        const raw_form = {
            name: req.body.name,
            surname: req.body.surname,
            department: req.body.department,
            level: req.body.level,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            tel: req.body.tel
        }

        Joi.validate(raw_form, schema, async (error, valid_form) => {
            if (error) return res.sendStatus(500);

            const password = valid_form.password;
            delete valid_form['password'];

            try {
                const OkPacket = await EditUser(
                    [...Object.values(valid_form)], Number(req.body.id), password
                );

                mail.sendMail({
                    to: req.body.email,
                    subject: 'Edit Account',
                    body: '1wqewq'
                });

                if (OkPacket) {
                    return res.status(200).send({
                        id: Number(req.body.id),
                        ...valid_form
                    })
                } else return res.sendStatus(500);
            } catch (e) {
                console.log(e)
                return res.sendStatus(500);
            }
        });
    })
    .delete(async (req, res, next) => {
        try {
            const OkPacket = await DeleteUser(Number(req.body.id))

            mail.sendMail({
                to: req.body.email,
                subject: 'Delete Account',
                body: 'hi'
            });

            if (OkPacket) return res.status(200).send({id: Number(req.body.id)})
        }
        catch (err) {
            console.log(err)
            return res.sendStatus(500);
        }
    })

module.exports = routes;