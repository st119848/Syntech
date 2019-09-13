const Modbus = require("../services/modbus").ModbusTCP;
const io = require('../services/streams/streams');
const {LogController} = require('../mysql/models/LogController');

const cache = require('../cache/cache');
const schedule = require('node-schedule');

const {
    handle,
    asyncForEach,
    extractModbusBuffer,
    getCurrentDateTime
} = require("../helpers/helpers");

const rule = new schedule.RecurrenceRule();
rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

schedule.scheduleJob(rule, async () => { 
    /**
     * Get all gates id from cache
     */
    const gates = JSON.parse(await cache.get('gateids'));
    if (!Array.isArray(gates) || gates.length === 0) return;

    await asyncForEach(gates, async (gate) => {
        /**
         * Get gate modbus buffer
         */
        let [modbus_err, modbus] = await handle(Modbus(gate.ip, 48, 64));
        if (modbus_err || !modbus) return; // skip this loop

        let [ // chunk buffer address to fields
            levels, sensors, overloads, mode, surged
        ] = extractModbusBuffer(modbus);

        await LogController([
            getCurrentDateTime(),
            gate.station,
            levels.join(','),
            sensors.join(','),
            overloads.join(','),
            gate.amount
        ]).catch(() => console.log("Error logging monitor."));
    })
});