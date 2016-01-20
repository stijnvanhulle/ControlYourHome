var app = require('../angular_app');

var planController = function ($scope, $rootScope, $http, $socket, $window, $location, md5) {

    $scope.load = function() {
        $window.document.title='Plan';
        $("body").css("background", "#f9f9f9");
        $("header").css("background", "#2c81ba");
    };

    $socket.on('connect', function(msg){
        $socket.emit('load_status', true);
    });

    $socket.on('leds', function (msg) {
        var led=msg.led;
        var status= msg.status;
        msg.error="";
        if (status != null) {
            switch(led) {
                case 1:
                    msg.place="Woonkamer";
                    break;
                case 2:
                    msg.place="Keuken";
                    break;
                case 3:
                    msg.place="Garage";
                    break;
            }
        }

        if (status != null) {
            $scope.lampChange(led,status);
        }
        $scope.$apply();

    });


    $scope.lampChange=function(lamp,msg){
        if(msg==true && lamp!=null){
            $("#lamp" + lamp + " #light").attr("class", "off");
            $("#lamp" + lamp + " #light").attr("class", "on");
        }else{
            $("#lamp" + lamp + " #light").attr("class", "on");
            $("#lamp" + lamp + " #light").attr("class", "off");
        }


    };
    $scope.clickLamp=function(lamp){
        var status= $("#lamp" + lamp + " #light").attr("class");
        if(status=="on"){
            $socket.emit('ledChange',{'led':lamp,'status':false});
        }else{
            $socket.emit('ledChange',{'led':lamp,'status':true});
        }

    };




    $scope.load();
};

//with webpack
app.controller("planController", ['$scope', '$rootScope', '$http', '$socket', '$window', '$location', 'md5',planController]);
module.exports=planController;

//without webpack:
//angular.module("app").controller("planController", ['$scope', '$rootScope', '$http', '$socket', '$window', '$location', 'md5',planController]);
