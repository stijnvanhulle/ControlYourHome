var app         = require('../angular_app');

var photoController=function ($scope, $rootScope, $http, $socket, $window, $location, md5) {

    $scope.images=[];
    $scope.imagesPassed=[];
    $scope.visibleTakeImage=true;
    $scope.loading=false;

    var audio;
    var stream;
    if(isMobile()==true){
        stream="http://raspberrypi.local:8080/?action=snapshot";
    }else{
        stream="http://raspberrypi.local:8080/?action=stream";
    }
    $scope.stream=stream;

    $scope.load = function () {
        $window.document.title = 'Photo';
        $("body").css("background", "#37A1E8");
        $("header").css("background", "rgba(0, 0, 0, 0.2)");
        $("main").css("background", "none");

        audio = new Audio('/sounds/camera.mp3');
        $scope.getImages();
    };


    $socket.on('newPicture', function (msg) {
        if(msg==true){
            $scope.getImages();
        }
    });

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
        $scope.loading=true;
        $http.get("/api/photo").then(function(response) {
            $scope.images=response.data.data;
            $scope.loading=false;
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


    $scope.load();
};

//with webpack
app.controller("photoController", ['$scope', '$rootScope', '$http', '$socket', '$window', '$location', 'md5',photoController]);

module.exports=photoController;

//without webpack:
//angular.module("app").controller("liveController", ['$scope', '$rootScope', '$http', '$socket', '$window', '$location', 'md5',liveController]);
