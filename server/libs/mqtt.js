var mqtt        = require('mqtt');
var mongo       = require('./mongo');
var background = require('./background');
var client      = mqtt.connect('mqtt://raspberrypi.local');
//var client      = mqtt.connect('mqtt://172.23.145.4');

var count={};

client.on('connect', function () {
    console.log('Raspberry pi connected');
    require("./background").start();

    client.subscribe('led1');
    client.subscribe('led2');
    client.subscribe('led3');
    client.subscribe("takePicture");
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
    client.subscribe("online");

    count.hum=0;
    count.temp=0;

    //anders wilt hij niet laden
    mongo= require('../libs/mongo');
});

client.on('message', function (topic, message) {
    //console.log(topic.toString());

    if(topic.toString()=="temp"){
        if(global.io!=null){

            var obj=JSON.parse(message.toString());
            count.temp +=1;
            if(count.temp==10){
                mongo.addData(topic.toString(),obj,function(err,result){
                    count.temp=0;
                });
            }

            global.io.emit(topic.toString(),obj);
        }

    }
    if(topic.toString()=="hum"){

        if(global.io!=null){
            var obj=JSON.parse(message.toString());
            count.hum +=1;
            if(count.hum==10){
                mongo.addData(topic.toString(),obj,function(err,result){
                    count.hum=0;
                });
            }



            global.io.emit(topic.toString(),obj);
        }

    }
    if(topic.toString()=="range"){
        if(global.io!=null){
            var obj=JSON.parse(message.toString());
            global.io.emit(topic.toString(),message.toString());
        }

    }
    if(topic.toString()=="led1_status"){
        console.log(message.toString());
        if(global.io!=null) {
            if (message == true) {
                global.io.emit('leds', {'led': 1, 'status': true});
            }
            if (message == false) {
                global.io.emit('leds', {'led': 1, 'status': false});
            }
        }

    }
    if(topic.toString()=="led2_status"){
        if(global.io!=null){
            if(message==true){
                global.io.emit('leds',{'led':2,'status':true});
            }
            if (message == false) {
                global.io.emit('leds', {'led': 2, 'status': false});
            }
        }
    }

    if(topic.toString()=="led3_status"){
        if(global.io!=null){
            if(message==true){
                global.io.emit('leds',{'led':3,'status':true});
            }
            if (message == false) {
                global.io.emit('leds', {'led': 3, 'status': false});
            }
        }
    }

    if(topic.toString()=="takePicture"){
        if(global.io!=null){
            var obj=JSON.parse(message.toString());
            global.io.emit(topic.toString(),message.toString());
        }

    }
    if(topic.toString()=="online"){
        console.log("ONLINE: " + message);
        if(global.io!=null){
            var obj=JSON.parse(message.toString());
            global.io.emit(topic.toString(),message.toString());
            global.online=true;
        }

    }
    if(topic.toString()=="switch"){
        if(global.io!=null){
            global.io.emit(topic.toString(),message.toString());
        }
    }
    if(topic.toString()=="motion"){
        if(global.io!=null){
            var obj=JSON.parse(message.toString());
            if(obj==1){
                background.postPhoto();
            }
            global.io.emit(topic.toString(),obj);
        }
    }
    if(topic.toString()=="display_status"){
        if(global.io!=null){
            global.io.emit("display",message.toString());
        }
    }
    if(topic.toString()=="relay_status"){
        if(global.io!=null){
            global.io.emit("relay",message.toString());
        }
    }

    //client.end();
});

module.exports=client;