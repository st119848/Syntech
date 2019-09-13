let express = require('express');
let app = express();

let server = require('http').Server(app);
let io = require('socket.io')(server);
server.listen(4000);

io.on('connection', function (socket) {
    console.log("SocketIO: Connected")
    io.removeAllListeners(); // prevent multi connections when user refresh page
  
    socket.on('disconnect', function () {
        io.emit('user disconnected');
    });
});
  
module.exports = io;