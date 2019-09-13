const routes = require('express').Router();
const Joi = require('@hapi/joi');

const {UpdateGateIDCache} = require('../../../cache/GateID');

const {
    CreateGate, EditGate, DeleteGate
} = require('../../../mysql/models/Gate');

const schema = Joi.object().keys({
    station: Joi.string().required(),
    coordinates: Joi.string().required(),
    log_interval: Joi.number().integer().required(),
    amount: Joi.number().integer().required(),
    max_level: Joi.number().integer().required(),
    ip: Joi.string().required(),
    port: Joi.string().required()
})

routes.route('/')
    .post((req, res, next) => {
        const raw_form = {
            station: req.body.station,
            coordinates: req.body.coordinates,
            log_interval: Number(req.body.log_interval), 
            amount: Number(req.body.amount),
            max_level: Number(req.body.max_level),
            ip: req.body.ip,
            port: req.body.port
        }

        Joi.validate(raw_form, schema, async (error, valid_form) => {
            if (error) return res.sendStatus(500);

            try {
                const OkPacket = await CreateGate([...Object.values(valid_form)]);

                if (OkPacket) {
                    await UpdateGateIDCache();

                    valid_form.coordinates = JSON.parse('[' + req.body.coordinates + ']');

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
    .put((req, res, next) => {
        const raw_form = {
            station: req.body.station,
            coordinates: req.body.coordinates,
            log_interval: Number(req.body.log_interval), 
            amount: Number(req.body.amount),
            max_level: Number(req.body.max_level),
            ip: req.body.ip,
            port: req.body.port
        }

        Joi.validate(raw_form, schema, async (error, valid_form) => {
            if (error) return res.sendStatus(500);

            try {
                const OkPacket = await EditGate([...Object.values(valid_form)], Number(req.body.id));

                if (OkPacket) {
                    await UpdateGateIDCache();

                    valid_form.coordinates = JSON.parse('[' + req.body.coordinates + ']');

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
            const OkPacket = await DeleteGate(Number(req.body.id))

            if (OkPacket) {
                await UpdateGateIDCache();

                return res.status(200).send({id: Number(req.body.id)})
            } else {
                return res.sendStatus(500);
            }
        }
        catch (e) {
            console.log(e)
            return res.sendStatus(500);
        }
    })

module.exports = routes;