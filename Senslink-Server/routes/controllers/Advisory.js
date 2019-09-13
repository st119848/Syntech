const routes = require('express').Router();
const storage = require('node-persist');
// const { AdvisoryLog } = require('../../database/models/advisory'); 
// const { GatesUpdate } = require('../../database/models/gate-update');
const { writeMultipleRegisters } = require("../../services/modbus");
const { asyncForEach } = require("../../helpers/helpers");
const { Flex } = require('../../line/reply_token');
const io = require('../../services/streams/streams');
const { getCurrentTime } = require("../../helpers/helpers");

const jwt = require("jwt-simple");
const passport = require("passport");
// to decode jwt
const ExtractJwt = require("passport-jwt").ExtractJwt;
// declare Strategy
const JwtStrategy = require("passport-jwt").Strategy;


const SECRET = "GWWFAqWDXL4xaWqiiyLJUXW87pzKqV";
// create Strategy
const jwtOptions = {
   jwtFromRequest: ExtractJwt.fromHeader("authorization"),
   secretOrKey: SECRET
};
const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
   if (payload.sub === "eqJFMA2yVQxr2Kjcbd9R") done(null, true);
   else done(null, false);
});

//ทำ Middleware สำหรับขอ JWT
const authMiddleWare = (req, res, next) => {
    if (req.body.username === "eqJFMA2yVQxr2Kjcbd9R" && 
        req.body.password === "REFs3DFoUnkXDDMQDGjmLKBxD9UC2Y") {
        next();
    } 
    else res.send("Wrong credentials");
};

routes.post('/auth', authMiddleWare, async (req, res) => {    
    let dt = new Date();
    let exp = Math.round(Date.now() / 1000 + 1799); // ~30 minutes
    let iat = dt.getTime();

    const payload = {
        sub: req.body.username,
        exp: exp,
        iat: iat
    };
    
    res.send(jwt.encode(payload, SECRET));
});

// insert Strategy to Passport
passport.use(jwtAuth);
// Passport Middleware
const requireJWTAuth = passport.authenticate("jwt", {session:false});

// insert middleware JWT authorization
routes.post("/advisory", requireJWTAuth, async (req, res) => {
    let gate_ip = req.body.gate_ip, // array of string
        gate_levels = JSON.parse("[" + req.body.gate_levels + "]") // array of number

    let _newVal = [];
    let tempNewVal = [...gate_levels];
    
    for (let i = 0, len = 2 * gate_levels.length; i < len; i++) {
        let val = !(i % 2) ? tempNewVal.shift() : 0;
        _newVal.push(val)
    };

    let gate_ai = await storage.getItem('gate_ai');
    const indexOfGate = gate_ai.findIndex(o => o.ip === gate_ip && o.mode === 1);

    if (~indexOfGate) {
        const gates_amount = gate_ai[indexOfGate].gates_amount;
        const station = gate_ai[indexOfGate].station;
        const oldVal = gate_ai[indexOfGate].levels;
        const overloads = gate_ai[indexOfGate].overloads;
        const max_level = gate_ai[indexOfGate].max_level;

        if (overloads.every(o => !o) && gate_levels.every(o => o <= max_level)) {
            try {
                await writeMultipleRegisters(48, _newVal, gate_ip);
                res.status(200).send("Gates gave been changed successfully.");

                await asyncForEach(gate_levels, async (_, index) => {
                    await GatesUpdate(
                        'Automatic', 'Automatic', station, index + 1, oldVal[index], gate_levels[index]
                    );
                });
                await AdvisoryLog(gate_ip, gate_levels);
                await Flex(
                    "Automatic", station, oldVal.slice(0, gates_amount), gate_levels.slice(0, gates_amount)
                );

                return;
            }
            catch { return res.status(500).send("Error on writing new values to gates."); }

            // try {
            //     await writeMultipleRegisters(48, _newVal, gate_ip);
            //     await Flex(
            //         "Automatic", station, oldVal.slice(0, gates_amount), gate_levels.slice(0, gates_amount)
            //     );

            //     res.status(200).send("Gates gave been changed successfully.");
            // }
            // catch { return res.status(500).send("Error on writing new values to gates"); }

            // try {
            //     await asyncForEach(gate_levels, async (_, index) => {
            //         await GatesUpdate(
            //             'Automatic', 'Automatic', station, index + 1, oldVal[index], gate_levels[index]
            //         );
            //     });
            //     await AdvisoryLog(gate_ip, gate_levels);

            //     return res.status(200);
            // }
            // catch { return res.status(200).send("Gates may have been changed. But error on logging."); }
        } else {
            return res.status(200).send("Gates changes not allow. Some gate is mulfunctioned, \
                                or change reached beyond allowed threshold.")
        }
    } else {
        io.emit('advisory', {
            gate_ip: gate_ip,
            gate_levels: gate_levels,
            updated: getCurrentTime()
        });

        return res.status(200).send("Sent gate levels to client as advisory.");
    }
});

module.exports = routes;