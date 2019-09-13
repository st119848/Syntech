const routes = require('express').Router();

const { writeSingleRegister, 
        writeMultipleRegisters 
} = require("../../services/modbus");

const {LogAction} = require('../../mysql/models/LogAction'); 

const { handle } = require("../../helpers/helpers");

const { asyncForEach, getCurrentDateTime } = require("../../helpers/helpers");
const { Flex } = require('../../line/reply_token');

// class WriteModbus() {
//     constructor(username, station_name, oldVal, newVal, index, ip) {
//         this.username = username;
//         this.station_name = station_name;
//         this.oldVal = oldVal;
//         this.newVal = newVal;
//         this.index = index;
//         this.ip = ip;
//         this.start_address = 48;
//     }

//     async write() {
//         const gate_address = this.start_address + this.index;

//         await writeSingleRegister(gate_address, this.newVal, this.ip);
//     }

//     async log() {

//     }
// }

routes.post('/writeSingleRegister', async (req, res) => {    
    let username = req.body.username,
        station_name = req.body.station,
        oldVal = Number(req.body.oldVal),
        newVal = Number(req.body.newVal),
        index = Number(req.body.index) * 2,
        ip = req.body.ip;

    const start_address = 48;

    let gate_address = start_address + index;

    try {
        // await writeSingleRegister(gate_address, newVal, ip);

        await LogAction([
            getCurrentDateTime(),
            username,
            station_name,
            (index/2) + 1,
            oldVal,
            newVal
        ]);

        return res.sendStatus(200);
    }
    catch (e) { return res.sendStatus(500); }
});

routes.post('/writeMultipleRegisters', async (req, res) => {    
    let id = req.body.id,
        username = req.body.username + " - AI",
        station_name = req.body.station,
        oldVal = JSON.parse('[' + req.body.oldVal + ']'),
        newVal = JSON.parse('[' + req.body.newVal + ']'),
        ip = req.body.ip;

    let _newVal = [];
    let tempNewVal = [...newVal];
    
    for (var i = 0, len = 2 * newVal.length; i < len; i++) {
        let val = !(i % 2) ? tempNewVal.shift() : 0;
        _newVal.push(val)
    };

    try {
        // await writeMultipleRegisters(48, _newVal, ip);
        await Flex(mode, station_name, [oldVal], [newVal]);
        await asyncForEach(newVal, async (_, index) => {
            // await GatesUpdate(
            //     id, username, station_name, (index/2) + 1, oldVal, newVal
            // );
        });
        return res.sendStatus(200);
    }
    catch (e) {
        return res.sendStatus(500);
    }
});

routes.post('/changeMode', async (req, res) => {    
    const mode = Number(req.body.mode),
        ip = req.body.ip;

    try {
        await writeSingleRegister(78, mode, ip);
        return res.sendStatus(200);
    }
    catch (e) {
        return res.sendStatus(500);
    }
});

module.exports = routes;