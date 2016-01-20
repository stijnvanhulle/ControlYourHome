var app         = require('../angular_app');
var Weather     = require('../models/weather');

var liveController=function ($scope, $rootScope, $http, $socket, $window, $location, md5) {


    $scope.weather = {
        outside: {},
        inside: {},
        forecast: {}
    };
    $scope.images=[];
    $scope.imagesPassed=[];
    $scope.visibleTakeImage=true;

    var audio;
    var stream;
    if(isMobile()==true){
        stream="http://raspberrypi.local:8080/?action=snapshot";
    }else{
        stream="http://raspberrypi.local:8080/?action=stream";
    }
    $scope.stream=stream;

    $scope.load = function () {
        $window.document.title = 'Live';
        audio = new Audio('/sounds/camera.mp3');
        $("body").css("background", "#37A1E8");
        $("header").css("background", "rgba(0, 0, 0, 0.2)");
        $("main").css("background", "none");


        var hour = moment().get('hour');
        if (hour >= 18) {
            if (hour >= 7) {
                $scope.weather.isDay = false;
            } else {
                $scope.weather.isDay = true;
            }

        } else {
            $scope.weather.isDay = true;
        }


        setupRadial();

        $scope.loadForecast();
        $scope.loadTwitter();
        $scope.getImages();
    };

    $scope.labels = [];
    $scope.series = ['Temperatuur', 'Humidity'];
    $scope.data = [
        [],
        []
    ];


    $socket.on('connect', function (msg) {
        $socket.emit('load_status', true);
    });


    var canRun=true;

    $socket.on('temp', function (msg) {
        //$scope.temperatures.push({hour: $scope.temperatures.length + 1, temperature: msg});
        $scope.weather.inside.temp = parseInt(msg);


        $scope.loadForecast();
        $scope.$apply();



    });
    $socket.on('hum', function (msg) {

        $scope.weather.inside.hum = parseInt(msg);
        $scope.loadForecast();
        $scope.$apply();

        updateChart();
    });

    $socket.on('takePicture', function (msg) {
       if(msg==true){
           $scope.takeImage();
       }
    });

    $socket.on('newPicture', function (msg) {
        if(msg==true){
            $scope.getImages();
        }
    });



    var updateChart=function(){
        if($scope.labels.length>20){
            $scope.labels=[];
            $scope.data = [
                [],
                []
            ];
        }
        if($scope.labels[$scope.labels.length-1]!=moment().format("HH:mm")){
            $scope.labels.push(moment().format("HH:mm"));
            $scope.data[0].push($scope.weather.inside.temp);
            $scope.data[1].push($scope.weather.inside.hum);
        }
    };


    $socket.on('motion', function (msg) {
        if(msg==true){
            $scope.getImage(function(image){
                if($scope.imagesPassed.length>5){
                    $scope.imagesPassed=[];
                }
                $scope.imagesPassed.push(image);
                console.log("iemand gepasseerd");
                if($(".images")[0]!=null){
                    $('.images').stop().animate({
                        scrollTop: $(".images")[0].scrollHeight
                    }, 800);
                }
            });

        }

    });

    $scope.getImages=function(){
        $http.get("/api/photo").then(function(response) {
            var images=[];
            var start=0;
            if(response.data.data.length>=9){
                start=response.data.data.length-10;
            }
            for(var i=start;i<response.data.data.length;i++){
                var item=response.data.data[i];
                images.push(item.photo);
            }

            $scope.images=images;
        });


    };
    $scope.getImage=function(cb){
        var url= "http://raspberrypi.local";
        $http.get(url).then(function(response) {
            var image= response.data.image;
            cb("data:image/png;base64," + image);

        });


    };
    $scope.takeImage=function(){
        var aantalSec=5;
        $scope.visibleTakeImage=false;
        var timeout = setInterval(function (){

            //toon teller op scherm
            setTimeout(function(){
                if(aantalSec>0){
                    countAnimation(aantalSec);
                }

                if(aantalSec==0){
                    audio.play();
                    flashAnimation();
                }


                if(aantalSec==-2){
                    var obj={};

                    clearInterval(timeout);
                    $scope.getImage(function(image){
                        $scope.images.push(image);
                        //post imager
                        $scope.stream=image;
                        obj.photo=image;

                        $.ajax({
                            url: "/api/photo/",
                            type: "POST",
                            data: obj
                        }).done(function( data ) {
                            //done
                            if(data.success){
                                $scope.visibleTakeImage=true;
                                showMessage('Foto opgeslaan','');
                            }else{
                                $scope.visibleTakeImage=true;
                                console.log(data.error);
                                showMessage('Mislukte foto','');
                            }

                        });

                        setTimeout(function(){
                            $scope.stream=stream;
                        }, 2000);
                    });


                }
                aantalSec--;

            }, 600);


        },1000);


    };


    $scope.loadForecast = function () {
        var lat = '';
        var long = '';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                lat = position.coords.latitude;
                long = position.coords.longitude;
                var weather = new Weather(lat,long);
                weather.getForecast(function(data){
                    //console.log(data);
                    $scope.weather.forecast=[];

                    for(var i=0;i<data.list.length;i++){
                        var day={
                            temp: parseInt(data.list[i].temp.day),
                            temp_min: parseInt(data.list[i].temp.min),
                            temp_max: parseInt(data.list[i].temp.max),
                            temp_night: parseInt(data.list[i].temp.night),
                            hum: data.list[i].humidity,
                            icon: data.list[i].weather[0].id + '-'  + data.list[i].weather[0].icon.substring(data.list[i].weather[0].icon.length-1,data.list[i].weather[0].icon.length),
                            description: data.list[i].weather[0].description,
                            name: data.list[i].weather[0].main,
                            speed: data.list[i].speed,
                            rain:  data.list[i].rain,
                            timestamp: data.list[i].dt,
                            day: moment.unix(data.list[i].dt).format("DD"),
                            month: moment.unix(data.list[i].dt).format("MM")
                        };
                        $scope.weather.forecast.push(day);
                    }





                    //console.log($scope.weather.forecast);
                    $scope.$apply();
                });

                weather.getCurrent(function(data){
                    //console.log(data);
                    $scope.weather.outside.description=data.weather[0].description;
                    $scope.weather.outside.name=data.weather[0].main;

                    $scope.weather.outside.temp=parseInt(data.main.temp);
                    $scope.weather.outside.hum=data.main.humidity;
                    $scope.weather.outside.icon=data.weather[0].id + '-'  + data.weather[0].icon.substring(data.weather[0].icon.length-1,data.weather[0].icon.length);

                    $scope.weather.outside.city=data.name.toLowerCase().replace('arrondissement ','');


                    $scope.$apply();
                });

            });
        }

    };

    $scope.loadTwitter=function(){
        $http.get("/api/twitter").then(function(response) {
            console.log(response.data);
            if(response.data!=null && response.data.success!=false){
                $scope.twitter=[];
                for(var i=0;i<3;i++){
                    var twitter={
                        description: response.data[i].text,
                        source: response.data[i].source,
                        userName:response.data[i].user.name,
                        userDescription: response.data[i].user.description,
                        userUrl: response.data[i].user.url,
                        userFollowers: response.data[i].user.followers_count

                    };
                    $scope.twitter.push(twitter);
                }


            }


            //console.log($scope.user);
        });
    };



    $scope.load();
};

//with webpack
app.controller("liveController", ['$scope', '$rootScope', '$http', '$socket', '$window', '$location', 'md5',liveController]);

module.exports=liveController;

//without webpack:
//angular.module("app").controller("liveController", ['$scope', '$rootScope', '$http', '$socket', '$window', '$location', 'md5',liveController]);
