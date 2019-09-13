const routes = require('express').Router();
const Joi = require('@hapi/joi');

const {UpdateStationIDCache} = require('../../../cache/StationID');

const {
    CreateStation, EditStation, DeleteStation
} = require('../../../mysql/models/Station');

// const { UpdateMonitor } = require('../../../mysql/models/UpdateMonitor');

const schema = Joi.object().keys({
    station: Joi.string().required(),
    coordinates: Joi.string().required(),
    address: Joi.string().required(),
    log_interval: Joi.number().integer().required(),
    thresholds: Joi.string().required(),
    water_id: Joi.string().min(36).max(36).required(),
    battery_id: Joi.string().min(36).max(36).required(),
    solar_id: Joi.string().min(36).max(36).required(),
    temp_id: Joi.string().min(36).max(36).required(),
    signal_id: Joi.string().min(36).max(36).required()
})

routes.route('/')
    .post((req, res, next) => {
        const raw_form = {
            station: req.body.station,
            coordinates: req.body.coordinates,
            address: req.body.address,
            log_interval: Number(req.body.log_interval), 
            thresholds: req.body.thresholds,
            water_id: req.body.water_id,
            battery_id: req.body.battery_id,
            solar_id: req.body.solar_id,
            temp_id: req.body.board_id,
            signal_id: req.body.signal_id
        }

        Joi.validate(raw_form, schema, async (error, valid_form) => {
            if (error) return res.sendStatus(500);

            try {
                const OkPacket = await CreateStation([...Object.values(valid_form)]);

                if (OkPacket) {
                    await UpdateStationIDCache();

                    valid_form.coordinates = JSON.parse('[' + req.body.coordinates + ']');
                    valid_form.thresholds = JSON.parse('[' + req.body.thresholds + ']');

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
            address: req.body.address,
            log_interval: Number(req.body.log_interval), 
            thresholds: req.body.thresholds,
            water_id: req.body.water_id,
            battery_id: req.body.battery_id,
            solar_id: req.body.solar_id,
            temp_id: req.body.board_id,
            signal_id: req.body.signal_id
        }

        Joi.validate(raw_form, schema, async (error, valid_form) => {
            if (error) return res.sendStatus(500);

            try {
                const OkPacket = await EditStation([...Object.values(valid_form)], Number(req.body.id));

                if (OkPacket) {
                    await UpdateStationIDCache();

                    valid_form.coordinates = JSON.parse('[' + req.body.coordinates + ']');
                    valid_form.thresholds = JSON.parse('[' + req.body.thresholds + ']');

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
            const OkPacket = await DeleteStation(Number(req.body.id))

            if (OkPacket) {
                await UpdateStationIDCache();

                return res.status(200).send({id: Number(req.body.id)})
            } else {
                return res.sendStatus(500);
            }
        }
        catch (err) {
            return res.sendStatus(500);
        }
    })

module.exports = routes;