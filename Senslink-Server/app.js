'use strict';

require('dotenv').config()
require('./main/senslink');
require('./main/modbus');
require('./main/LogController');
require('./main/log');
// require('./main/reconcileLog');
require('./cache/cache');
require('./mysql/mysql');
require('./sms/sms');

let normalizedPath = require("path").join(__dirname, "./services/streams/emits");
require("fs").readdirSync(normalizedPath).forEach((file) => {
  require(`./services/streams/emits/${file}`);
});

let express = require('express');
let app = express();

let routes = require('./routes/routes');
app.use('/', routes);

const port = process.env.PORT || 443;

app.listen(port, () => console.log(`Listening on port ${port}...`))

