var app         = require('./app');
var server      = require('http').Server(app);
var https       = require('https');
var io          = require('socket.io')(server);
var fs          = require('fs');

var options={
    port:80,
    secure_port:443,
    /*
     certificate: {
     key: fs.readFileSync('/srv/bob/certs/self_signed_ssl.key'),
     cert: fs.readFileSync('/srv/bob/certs/self_signed_ssl.crt')
     }
     */
};

server.listen(options.port, function(){
    var address = server.address();
    if(address.address=="::"){
        address.address="localhost";
    }
    console.log("Server listening on: http://%s/:%s",address.address, address.port);
    global.address="http://" + address.address + '/';
    global.port=address.port;
});

/*
 https.createServer(options.certificate, app).listen(options.secure_port, function(){
    var address = server.address();
    if(address.address=="::"){
        address.address="localhost";
    }
    console.log("Server listening on: http://%s/:%s",address.address, address.port);
    global.address="http://" + address.address + '/:'+ address.port;
 });
 */

require('./libs/socket')(io,function(result){
    if(result==true){
        console.log("Server socket connected");
    }else{
        console.log("Server socket not connected");
        process.exit(1);
    }
});



module.exports = server;