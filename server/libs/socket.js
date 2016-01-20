var client = require('./mqtt');
var background = require('./background');
var request = require('request');

(function subscribe() {
    client.subscribe('led1');
    client.subscribe('led2');
    client.subscribe('led3');
    client.subscribe('online');
    client.subscribe('takePicture');
    client.subscribe('relay');
    client.subscribe("display");
    client.subscribe('led1_status');
    client.subscribe('led2_status');
    client.subscribe('led3_status');
    client.subscribe('relay_status');
    client.subscribe("display_status");
    client.subscribe('temp');
    client.subscribe('hum');
    client.subscribe('range');
    client.subscribe("motion");
})();


var ledSend = function (nr, msg, socket) {
    console.log("led " + nr.toString() + ": " + (msg == true ? "aan" : "uit"));
    client.publish('led' + nr.toString(), msg.toString()); // moet string zijn
    if (msg == true) {
        socket.emit("message", "led" + nr.toString() + " is aangegaan");
    } else {
        socket.emit("message", "led" + nr.toString() + " is uitgegaan");
    }
    socket.emit('load_status', true);
};

module.exports = function (io, cb) {
    io.on('connection', function (socket) {

        console.log('a user connected');
        io.emit('connect', 'a user connected ' + socket.toString());

        socket.on('disconnect', function () {
            console.log('user disconnected');
        });

        socket.on('ledChange', function (msg) {
            var led = msg.led;
            var newStatus = msg.status;
            ledSend(led, newStatus, io);
        });
        socket.on('load_status', function (msg) {
            client.publish('load_status', msg.toString()); // moet string zijn
        });
        socket.on('displayChange', function (msg) {
            client.publish('display', msg.toString()); // moet string zijn
        });

        socket.on('relayChange', function (msg) {
            client.publish('relay', msg.toString()); // moet string zijn
        });
        //io's
        io.on('motion', function (msg) {
            console.log("motion"+ msg);
            if (msg == true) {
                background.postPhoto();
            }
        });
        io.on('message', function (msg) {
            io.emit("message", msg);
        });

        global.socket = socket;
        global.io = io;
        if (global.socket != null) {
            cb(true);
        } else {
            cb(false);
        }
    });
};
