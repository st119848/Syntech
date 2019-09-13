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
rule.second = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57]; // every 3 second

schedule.scheduleJob(rule, async () => { 
  /**
   * Get all gates id from cache
   */
  const gates = JSON.parse(await cache.get('gateids'));
  // console.log(gates)
  if (!Array.isArray(gates) || gates.length === 0) {
    io.emit('gates', []);
    return;
  };

  let result = [];
  await asyncForEach(gates, async (gate) => {
    /**
     * Get gate modbus buffer
     */
    let [modbus_err, modbus] = await handle(Modbus(gate.ip, 48, 64));
    if (modbus_err || !modbus) return; // skip this loop

    let [ // chunk buffer address to fields
        levels, sensors, overloads, mode, surged
    ] = extractModbusBuffer(modbus);

    /**
     * For Automatic Mode
     */
    // let gate_ai = await storage.getItem('gate_ai');
    // const indexOfExisted = gate_ai.findIndex(o => o.ip === gate.ip);
    // if (~indexOfExisted) { // ip existed
    //   gate_ai[indexOfExisted] = {
    //     ip: gate.ip, mode: mode, levels: levels, station: gate.station_name,
    //     overloads: overloads, max_level: Number(gate.metas.max_level),
    //     gates_amount: Number(gate.metas.gate_amount)
    // };
    // } else { gate_ai.push({
    //   ip: gate.ip, mode: mode, levels: levels, station: gate.station_name,
    //   overloads: overloads, max_level: Number(gate.metas.max_level),
    //   gates_amount: Number(gate.metas.gate_amount)
    // }) };
    // await storage.setItem('gate_ai', gate_ai);

    result.push({
      station_name: gate.station,
      location: JSON.parse('[' + gate.coordinates + ']'),
      levels: levels,
      sensors: sensors,
      overloads: overloads,
      mode: mode,
      max_level: Number(gate.max_level),
      gate_amount: Number(gate.amount),
      ip: gate.ip,
      updated: getCurrentDateTime()
    });
  });

  if (Array.isArray(result) && result.length > 0) {
    io.emit('gates', result);
  };
})

