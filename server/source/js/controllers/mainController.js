var app = require('../angular_app');

var mainController = function ($scope, $rootScope, $route,$http, $socket, $window, $location, md5, $data) {

    $scope.load = function() {
        $window.document.title='IOT';
        $socket.emit('load_status', true);
        $scope.getUser();
    };
    $scope.page="";
    $scope.USER=null;
    $scope.logff=false;
    $scope.sensors={};
    $scope.sensors.leds=[{'led':1},{'led':2},{'led':3}];

    $scope.$on('$routeChangeSuccess', function(event, current) {

        $scope.page=$route.current.name;
        if($route.current.name==null){
            window.location = "/404";
        }
    });



    $socket.on('connect', function(msg){
        console.log('connected');


        //$socket.emit('load_status',true);
    });
    $socket.on('message', function(msg){
        showMessage(msg.toString(),'');
    });
    $socket.on('online', function(msg){
        if(msg==true){
            showMessage('Raspberry pi gevonden','');
        }else{
            showMessage('Raspberry pi afgesloten','');
        }
        $scope.$apply();
    });
    $socket.on('temp', function(msg){
        $scope.sensors.temp=msg;
        $scope.$apply();
    });
    $socket.on('hum', function(msg){
        $scope.sensors.hum=msg;
        $scope.$apply();
    });

    $socket.on('range', function(msg){
        $scope.sensors.range=msg;
        $scope.$apply();
    });

    $socket.on('relay', function(msg){
        $scope.sensors.relay=msg;
        $scope.$apply();
    });
    $socket.on('switch', function(msg){
        $scope.sensors.switch=msg;
        $scope.$apply();
    });
    $socket.on('display', function(msg){
        $scope.displayText=msg;
        $scope.$apply();
    });

    $socket.on('leds', function (msg) {
        var led=msg.led;
        var status= msg.status;
        msg.error="";


        if (status != null) {
            switch(led) {
            case 1:
                msg.place="Woonkamer";
                $scope.sensors.leds[0]=msg;
                break;
            case 2:
                msg.place="Keuken";
                $scope.sensors.leds[1]=msg;
                break;
            case 3:
                msg.place="Garage";
                $scope.sensors.leds[2]=msg;
                break;
            }
        }
        $scope.$apply();

    });

    $scope.TurnLedOn=function(lamp){
        $socket.emit('ledChange',{'led':lamp.led,'status':true});
    };
    $scope.TurnLedOff=function(lamp){
        $socket.emit('ledChange',{'led':lamp.led,'status':false});
    };

    $scope.TurnRelayOn=function(bool){
        $socket.emit('relayChange',bool);
    };
    $scope.TurnRelayOff=function(bool){
        $socket.emit('relayChange',bool);
    };


    $scope.UpdateDisplay=function(displayText){
        $socket.emit('displayChange',displayText);
    };


    $scope.getUser=function(){
        $.ajax({
            url: "/api/auth",
            type: "GET"
        }).done(function( data ) {
            //done
            if(data.success){
                $scope.USER=data.user;
                $scope.logff=true;
            }else{
                $scope.USER=null;
                $scope.logff=false;
            }
            $scope.$apply();
        });
    };



    $scope.logOff=function(){
        $.ajax({
            url: "/api/auth/logoff",
            type: "POST"
        }).done(function( data ) {
            //done
            if(data.success){
                $location.path('/');
                $window.location.reload();
            }else{
                console.log(data.error);
                showMessage('Wachtwoord of username niet correct','');
                $location.path('/');
            }


        });
    };

    $scope.hideMobile=function(){
        $('nav#menu').removeClass("mobile");
    };
    $scope.load();
};

//with webpack
app.controller("mainController", ['$scope', '$rootScope','$route', '$http', '$socket', '$window', '$location', 'md5','data', mainController]);
module.exports=mainController;

//without webpack:
//angular.module("app").controller("mainController", ['$scope', '$rootScope', '$http', '$socket', '$window', '$location', 'md5', mainController]);

