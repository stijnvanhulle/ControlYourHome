/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:80/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	//with webpack

	//js
	//require("angular");
	//require("angular-resource");
	//require("angular-route");
	//require('angular-animate');
	//require('angular-aria');
	//require('angular-sanitize');
	//require('moment');

	var angular             = __webpack_require__(1);
	var mainController      = __webpack_require__(3);
	var loginController     = __webpack_require__(4);
	var liveController      = __webpack_require__(5);
	var planController      = __webpack_require__(7);
	var registerController  = __webpack_require__(8);
	var filterController    = __webpack_require__(9);
	var accessController    = __webpack_require__(10);
	var scheduleController  = __webpack_require__(11);
	var photoController     = __webpack_require__(12);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	//stijn van hulle controllers
	var routes      = __webpack_require__(2);


	var subdomain='';
	var app = angular.module('app',['ngRoute','ngAnimate','ngResource','angular-md5','angular-svg-round-progress','chart.js']);


	app.config(function($animateProvider) {
	        $animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);
	});

	app.directive('onFinishRender', function ($timeout) {
	    return {
	        restrict: 'A',
	        link: function (scope, element, attr)
	        {
	            if (scope.$last === true) {
	                scope.$evalAsync(attr.onFinishRender);
	            }
	        }
	    }
	});

	app.factory('$socket', function(){
	    return io();
	    //return io.connect('http://37.59.114.49');
	});
	app.config(['$routeProvider', '$locationProvider', routes]);


	app.directive('loading', function() {
	    return {
	        restrict: 'E',
	        replace: 'false',
	        template: '<div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div>'
	    };
	});



	app.service('data', function() {

	    // private variable
	    var _data = {};

	    // public API
	    this.user = _data;
	});

	app.filter('unique', function() {
	    return function(collection, keyname) {
	        var output = [],
	            keys = [];

	        angular.forEach(collection, function(item) {
	            var key = item[keyname];
	            if(keys.indexOf(key) === -1) {
	                keys.push(key);
	                output.push(item);
	            }
	        });

	        return output;
	    };
	});

	app.filter("weekday", function() {

	    return function(id) {
	        return moment.weekdays(parseInt(id) + 1);
	    };
	});
	app.filter("hour", function() {

	    return function(id) {
	        return moment().hours(id).format("hh") + " uur";
	    };

	});
	app.filter("hourAndDay", function() {
	    return function(date) {
	        return moment(date).format("dddd") +" om " +  moment(date).format("HH:mm");
	    };

	});
	app.filter("fromNow", function() {

	    return function(date) {
	        return moment(date).fromNow();
	    };
	});

	//


	moment.locale('nl');


	module.exports=app;

/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Created by stijnvanhulle on 02/12/15.
	 */
	var routes=function($routeProvider, $locationProvider) {
	    $routeProvider
	        .when('/', {
	            name:'home',
	            redirectTo: '/live'
	        })
	        .when('/plan', {
	            name:'plan',
	            templateUrl: '/partials/plan',
	            controller: 'planController',
	            reloadOnSearch: false

	        })
	        .when('/live', {
	            name:'live',
	            templateUrl: '/partials/live',
	            controller: 'liveController',
	            reloadOnSearch: false

	        })
	        .when('/access', {
	            name:'access',
	            templateUrl: '/partials/access',
	            controller: 'accessController',
	            reloadOnSearch: false

	        })
	        .when('/schedule', {
	            name:'schedule',
	            templateUrl: '/partials/schedule',
	            controller: 'scheduleController',
	            reloadOnSearch: false

	        })
	        .when('/filter', {
	            name:'filter',
	            templateUrl: '/partials/filter',
	            controller: 'filterController',
	            reloadOnSearch: false

	        })
	        .when('/login', {
	            name:'login',
	            templateUrl: '/partials/login',
	            reloadOnSearch: false
	        })
	        .when('/photo', {
	            name:'photo',
	            controller: 'photoController',
	            templateUrl: '/partials/photo',
	            reloadOnSearch: false
	        })
	        .otherwise({
	            redirectTo: '/404'
	        });

	    $locationProvider.html5Mode(true);
	};


	module.exports=routes;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

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



/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	var loginController = function ($scope, $rootScope, $http, $socket, $window, $location, md5,$data) {
	    $scope.member={};


	    $scope.load = function() {
	        $window.document.title='Login';
	    };

	    $scope.login=function(email,password){
	        $.ajax({
	            url: "/api/auth/local",
	            type: "POST",
	            data: {email:email, password: password}
	        }).done(function( data ) {
	            //done
	            if(data.success){
	                $location.path('/');
	                $window.location.reload();
	            }else{
	                console.log(data.error);
	                showMessage('Wachtwoord of username niet correct','');
	                loginError(true);
	            }


	        });
	    };




	    $scope.load();
	};

	//with webpack
	app.controller("loginController", ['$scope', '$rootScope', '$http', '$socket', '$window', '$location', 'md5','data',loginController]);

	module.exports=loginController;

	//without webpack:
	//angular.module("app").controller("loginController", ['$scope', '$rootScope', '$http', '$socket', '$window', '$location', 'md5',loginController]);


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var app         = __webpack_require__(1);
	var Weather     = __webpack_require__(6);

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


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	function Weather(lat,long){
	    if(lat=== undefined){
	        lat="50.83053";
	    }
	    if(long=== undefined){
	        long="3.26446";
	    }
	    this.lat=lat;
	    this.long=long;
	    this.appID="a5b1cbd8980ee21b5da7640982d060b2";
	    var urlForecast="http://api.openweathermap.org/data/2.5/forecast/daily/?lat="+ this.lat + "&lon=" +  this.long +"&units=metric&appid=" + this.appID;
	    var urlCurrent="http://api.openweathermap.org/data/2.5/weather?lat="+ this.lat + "&lon=" +  this.long +"&units=metric&appid=" + this.appID;

	    //http://api.openweathermap.org/data/2.5/forecast?lat=50.83053&lon=3.26446&units=metric&appid=a5b1cbd8980ee21b5da7640982d060b2
	    //http://api.openweathermap.org/data/2.5/weather?lat=50.83053&lon=3.26446&units=metric&appid=a5b1cbd8980ee21b5da7640982d060b2

	    var getForecast=function(cb){
	        $.ajax({
	            url: urlForecast,
	            type: "GET",
	            data: {}
	        }).done(function( data ) {
	            //done
	            if (typeof cb === "function") {
	                // Call it, since we have confirmed it is callable​
	                cb(data);
	            }


	        });
	    };
	    var getCurrent=function(cb){
	        $.ajax({
	            url: urlCurrent,
	            type: "GET",
	            data: {}
	        }).done(function( data ) {
	            //done
	            if (typeof cb === "function") {
	                // Call it, since we have confirmed it is callable​
	                cb(data);
	            }


	        });
	    };

	    var PublicAPI={
	        getForecast:getForecast,
	        getCurrent:getCurrent

	    };

	    return PublicAPI;
	};

	module.exports=Weather;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	var registerController = function ($scope, $rootScope, $http, $socket, $window, $location, md5) {
	    $scope.member = {};
	    $scope.member.Sex = false;

	    $scope.load = function () {
	        $("body").css("background", "#f9f9f9");
	        $("header").css("background", "#2c81ba");

	        $window.document.title = 'Registreer';
	    };

	    $scope.load();
	};

	//with webpack
	app.controller("registerController", ['$scope', '$rootScope', '$http', '$socket', '$window', '$location', 'md5',registerController]);
	module.exports=registerController;


	//without webpack:
	//angular.module("app").controller("registerController", ['$scope', '$rootScope', '$http', '$socket', '$window', '$location', 'md5',registerController]);



/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	var filterController = function ($scope, $rootScope, $http, $socket, $window, $location, md5) {
	    $scope.from=new Date();
	    $scope.from.setDate($scope.from.getDate() - 1);
	    $scope.to=new Date();
	    $scope.showFind=true;
	    $scope.current={};
	    $scope.tempMax;
	    $scope.tempMin;
	    $scope.tempAvg;
	    $scope.humAvg;
	    $scope.hideFilter=true;
	    $scope.loading=false;

	    $scope.load = function () {
	        $scope.findData();
	        $window.document.title = 'Filter';
	        $("body").css("background", "#f9f9f9");
	        $("header").css("background", "#2c81ba");

	    };

	    $scope.data_all=[];
	    $scope.labels = [];
	    $scope.series = ['Temperatuur', 'Humidity'];
	    $scope.data = [
	        [],
	        []
	    ];

	    $scope.findData=function(){
	        if($scope.from!=null && $scope.to!=null){

	            if(moment($scope.to).isBefore($scope.from,'day')){
	                showMessage("Geen datum in chronologische volgorden",'');
	                $scope.from.setDate($scope.from.getDate() - 1);
	                $scope.to=new Date();
	            }else{
	                $scope.loading=true;
	                $.ajax({
	                    url: "/api/data/find",
	                    type: "POST",
	                    data: {from:$scope.from, to: $scope.to}
	                }).done(function( data ) {
	                    //done
	                    $scope.loading=false;


	                    if(data.success){
	                        //reset
	                        $scope.data = [
	                            [],
	                            []
	                        ];
	                        $scope.labels = [];


	                        $scope.data_all=data.data;
	                        if($scope.data_all!=null){
	                            addData($scope.data_all);
	                        }

	                        $scope.showFind=false;
	                    }else{
	                        $scope.data = [
	                            [],
	                            []
	                        ];
	                        $scope.labels = [];
	                        showMessage("Error bij het ophalen van data",'');
	                        $scope.showFind=true;
	                    }



	                });
	            }


	        }

	    };
	    var addData=function(data){
	        var tempMax=null;
	        var tempMin=null;
	        var temp=null;
	        var hum=null;

	        var countTemp={count:0, i:0};
	        var countHum={count:0, i:0};

	        for(var i=0;i<data.length;i++){

	            if(data[i]!=null){
	                if(data[i].name=="temp"){
	                    countTemp.count=parseInt(countTemp.count) + parseInt(data[i].value);
	                    countTemp.i++;
	                    if(tempMax==null){
	                        tempMax=data[i].value;
	                    }else{
	                        if(tempMax<data[i].value){
	                            tempMax=data[i].value;
	                        }
	                    }
	                    if(tempMin==null){
	                        tempMin=data[i].value;
	                    }else{
	                        if(tempMin>data[i].value){
	                            tempMin=data[i].value;
	                        }
	                    }


	                    temp=data[i].value;
	                }
	                if(data[i].name=="hum"){
	                    countHum.count =parseInt(countHum.count) + parseInt(data[i].value);
	                    countHum.i++;
	                    hum=data[i].value;
	                }
	                if(temp!=null && hum !=null){
	                    updateChart(temp, hum, data[i].createdOn);
	                }


	            }


	        }

	        if($scope.data[0].length==0 || $scope.data[1].length==0){
	            $scope.hideFilter=true;
	        }else{
	            $scope.hideFilter=false;
	            $scope.current.hum=$scope.data[0][0];
	            $scope.current.temp=$scope.data[1][0];

	            $scope.tempMax=tempMax;
	            $scope.tempMin=tempMin;

	            $scope.tempAvg=Math.round(countTemp.count / countTemp.i,2);
	            $scope.humAvg=Math.round(countHum.count / countHum.i,2);
	        }
	        $scope.$apply();





	    };

	    var updateChart=function(temp, hum, date){
	        var label=moment(date).format("D") + " " + moment(date).format("MMM") + " " + moment(date).format("HH")+ " uur";

	        if($scope.labels[$scope.labels.length-1]!=label || $scope.labels.length==1){
	            $scope.labels.push(label);
	            if(temp!=null){
	                $scope.data[0].push(temp);
	            }
	            if(hum!=null){
	                $scope.data[1].push(hum);
	            }
	            $scope.$apply();

	        }


	    };

	    $scope.onClick = function (points, evt) {
	        console.log(points, evt);
	        $scope.current.hum=points[1].value;
	        $scope.current.temp=points[0].value;
	        $scope.$apply();
	    };
	    $scope.saveJSON = function () {
	        $scope.toJSON = '';
	        $scope.toJSON = angular.toJson($scope.data_all);
	        var blob = new Blob([$scope.toJSON], { type:"application/json;charset=utf-8;" });
	        var downloadLink = angular.element('<a></a>');
	        downloadLink.attr('href',window.URL.createObjectURL(blob));
	        downloadLink.attr('download', 'data.json');
	        downloadLink[0].click();
	    };

	    $scope.print=function(){
	        window.print();
	    };

	    $scope.save=function(){
	        window.print();
	    };

	    $scope.load();
	};

	//with webpack
	app.controller("filterController", ['$scope', '$rootScope', '$http', '$socket', '$window', '$location', 'md5',filterController]);
	module.exports=filterController;


	//without webpack:
	//angular.module("app").controller("registerController", ['$scope', '$rootScope', '$http', '$socket', '$window', '$location', 'md5',registerController]);



/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	var accessController=function ($scope, $rootScope, $http, $socket, $window, $location, md5) {
	    $scope.users=[];
	    $scope.newUser={};
	    $scope.usertypes={};
	    $scope.loading=false;

	    $scope.load = function () {
	        $window.document.title = 'User access';
	        $("body").css("background", "#f9f9f9");
	        $("header").css("background", "#2c81ba");
	        $scope.getUsers();
	        $scope.getUserTypes();
	    };
	    $scope.getUsers=function(){
	        $scope.loading=true;
	        $.ajax({
	            url: "/api/user",
	            type: "get"

	        }).done(function( data ) {
	            //done
	            $scope.loading=false;

	            if(data.success){
	                $scope.users=data.data;
	                angular.forEach($scope.users,function(user){
	                    user.createdOnAgo=moment(user.createdOn).fromNow();
	                });
	                $scope.$apply();
	            }else{

	            }


	        });
	    };
	    $scope.getUserTypes=function(){
	        $.ajax({
	            url: "/api/user/types",
	            type: "get"

	        }).done(function( data ) {
	            //done
	            if(data.success){
	                $scope.usertypes=data.data;
	            }else{

	            }
	        });
	    };



	    $scope.updateUser=function(user){
	        if(user.active==true){
	            user.active=false;
	        }else{
	            user.active=true;
	        }
	        $scope.loading=true;
	        $.ajax({
	            url: "/api/user",
	            type: "put",
	            data: {_id:user._id, active: user.active}
	        }).done(function( data ) {
	            //done
	            $scope.loading=false;
	            if(data.success){
	                showMessage(user.firstname + " " + user.lastname + " is aangepast",'');
	                $scope.getUsers();
	            }else{
	                showMessage("Gegevens niet goed ingevuld",'');

	            }


	        });
	    };
	    $scope.removeUser=function(user, index){
	        $.ajax({
	            url: "/api/user/remove",
	            type: "post",
	            data: {id:user._id}
	        }).done(function( data ) {
	            //done
	            if(data.success){
	                $(".items div#" + index).css("animation"," remove 0.4s linear forwards");
	                setTimeout(function(){
	                    $(".items div#" + index).css('display','none');
	                    showMessage(user.firstname + " " + user.lastname + " is verwijderd",'');
	                }, 400);

	            }else{
	                showMessage("Gegevens niet goed ingevuld",'');
	            }


	        });
	    };
	    $scope.addUser=function(){
	        if($scope.newUser!=null){

	            if($scope.newUser.firstname!=null && $scope.newUser.lastname && $scope.newUser.email && $scope.newUser.password && $scope.newUser.type){
	                $scope.loading=true;
	                $.ajax({
	                    url: "/api/user",
	                    type: "post",
	                    data: $scope.newUser
	                }).done(function( data ) {
	                    //done
	                    $scope.loading=false;
	                    if(data.success){
	                        $scope.getUsers();
	                        showMessage($scope.newUser.firstname + " " + $scope.newUser.lastname + " is toegevoegd" );
	                        $scope.closeModal();


	                    }else{
	                        showMessage("Gegevens niet goed ingevuld",'');
	                    }

	                });
	            }else{
	                showMessage("Gegevens niet goed ingevuld",'');
	            }


	        }

	    };
	    $scope.passwordCheck=function(){
	        if($scope.newUser.password!=$scope.newUser.password_repeat){
	            $scope.newUser.error="Wachtenwoorden zijn niet hetzelfde";
	        }else{
	            $scope.newUser.error="";
	        }
	    };
	    $scope.showModal=function(){
	        $('#modal .content').css("animation", "bounceIn .8s linear both");
	        $scope.visibleModal=true;
	    };

	    $scope.closeModal=function(){
	        $scope.newUser={};
	        $('#modal .content').css("animation", "fadeInDown .3s linear both");
	        setTimeout(function(){
	            $scope.visibleModal=false;
	        }, 200);

	    };

	    $socket.on('connect', function (msg) {
	        $socket.emit('load_status', true);
	    });




	    $scope.load();
	};

	//with webpack
	app.controller("accessController", ['$scope', '$rootScope', '$http', '$socket', '$window', '$location', 'md5',accessController]);

	module.exports=accessController;

	//without webpack:
	//angular.module("app").controller("liveController", ['$scope', '$rootScope', '$http', '$socket', '$window', '$location', 'md5',liveController]);


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	var scheduleController=function ($scope, $rootScope, $http, $socket, $window, $location, md5) {
	    $scope.schedules=[];
	    $scope.leds=[];
	    $scope.days=[];
	    $scope.hours=[];

	    $scope.schedulesNew=[];

	    $scope.updatedDays=[];
	    $scope.updatedHours=[];
	    $scope.currentDays=[];
	    $scope.currentHours=[];

	    $scope.newSchedule={}; //for nes
	    $scope.currentSchedule={};//for update
	    $scope.visibleModal=false;
	    $scope.visibleSchedule=false;
	    $scope.loading=false;

	    $scope.load = function () {
	        $window.document.title = 'Schedule';
	        $("body").css("background", "#f9f9f9");
	        $("header").css("background", "#2c81ba");
	        $scope.getSchedules();
	        $scope.getLeds();
	        $scope.getDays();
	        $scope.getHours();


	    };
	    $scope.getSchedules=function(){
	        $scope.loading=true;
	        $.ajax({
	            url: "/api/schedule",
	            type: "get"

	        }).done(function( data ) {
	            //done
	            $scope.loading=false;
	            if(data.success){

	                $scope.schedules=data.data;
	                $scope.$apply();
	            }else{
	            }

	        });
	    };




	    $scope.getLeds=function(){
	      for(var i=0;i<3;i++){
	          $scope.leds.push(i+1);
	      }
	    };
	    $scope.getDays=function(){
	        for(var i=0;i<7;i++){
	            $scope.days.push({id:i,value:moment().weekday(i).format('dddd')});
	        }
	    };
	    $scope.getHours=function(){
	        for(var i=0;i<24;i++){
	            $scope.hours.push({id:i,value:moment().set('hour',i).format('HH') + " uur"});
	        }
	    };

	    $scope.updateHoursDays=function(){
	        if($scope.updatedDays!=null){
	            if($scope.updatedDays.length<=1){
	                //1dag meer uren
	                updateSchedules();
	            }else{
	                if($scope.updatedHours!=null){
	                    if($scope.updatedHours.length<=1){
	                        //meerdere dagen 1uur
	                        if($scope.newSchedule.hours!=null){
	                            var item=$scope.updatedHours[0];
	                            $scope.updatedHours=[];
	                            $scope.updatedHours.push(item);
	                        }

	                        updateSchedules();
	                    }else{
	                        //meerdere dagen meerdere uren
	                        if($scope.newSchedule.days!=null){
	                            var item=$scope.updatedDays[0];
	                            $scope.updatedDays=[];
	                            $scope.updatedDays.push(item);
	                        }

	                        updateSchedules();

	                    }
	                }

	            }
	        }




	    };

	    var updateSchedules=function(){
	        if($scope.currentSchedule._id!=null){
	            $scope.currentSchedule.hours=$scope.updatedHours;
	            $scope.currentSchedule.days=$scope.updatedDays;
	        }else{
	            $scope.newSchedule.hours=$scope.updatedHours;
	            $scope.newSchedule.days=$scope.updatedDays;
	        }

	    };

	    var reset=function(){
	        $scope.getSchedules();
	        $scope.newSchedule={};
	        $scope.schedulesNew=[];
	        $scope.updatedDays=[];
	        $scope.updatedHours=[];
	    };
	    $scope.clearSchedules=function(){
	        reset();
	        $scope.visibleSchedule=false;

	    };

	    $scope.addSchedule=function(item){
	        if(item==null){
	            item=$scope.newSchedule;
	        }
	        if(item.sensor!=null && item.status!=null && item.days!=null && item.hours!=null){
	            $scope.schedulesNew.push(item);
	            $scope.newSchedule={};
	            $scope.updatedDays=[];
	            $scope.updatedHours=[];
	        }else{
	            showMessage("Niet alles is ingevuld","");
	        }


	    };
	    $scope.addSchedules=function(){
	        $scope.loading=true;
	        for(var i=0;i<$scope.schedulesNew.length;i++){
	            var item=$scope.schedulesNew[i];

	            $.ajax({
	                url: "/api/schedule",
	                type: "post",
	                data: item
	            }).done(function( data ) {
	                //done
	                $scope.loading=false;
	                if(data.success){
	                    showMessage("Nieuwe schedule is aangemaakt",'');
	                    reset();
	                }else{
	                    showMessage("Niet alles is ingevuld","");

	                }



	            });
	        }


	    };
	    $scope.showModal=function(schedule){
	        $scope.currentSchedule={};
	        $scope.currentDays=[];
	        $scope.currentHours=[];

	        $scope.currentSchedule=schedule;

	        $scope.updatedDays=$scope.currentSchedule.days;
	        $scope.updatedHours=$scope.currentSchedule.hours;

	        $('#modal .content').css("animation", "bounceIn .8s linear both");
	        $scope.visibleModal=true;

	    };


	    $scope.closeModal=function(){
	        $scope.currentSchedule={};
	        $scope.currentDays=[];
	        $scope.currentHours=[];

	        $('#modal .content').css("animation", "fadeInDown .3s linear both");
	        setTimeout(function(){
	            $scope.visibleModal=false;
	        }, 200);
	    };
	    $scope.add=function(){
	      $scope.visibleSchedule=true;
	    };


	    $scope.updateSchedule=function(){
	        if($scope.currentSchedule!=null){
	            $scope.loading=true;
	            var item=$scope.currentSchedule;
	            console.log(item);
	            $.ajax({
	                url: "/api/schedule",
	                type: "put",
	                data: item
	            }).done(function( data ) {
	                //done
	                $scope.loading=false;
	                if(data.success){
	                    showMessage("Schedule is aangepast",'');
	                    reset();
	                    $scope.visibleSchedule=false;
	                    $scope.newSchedule={}; //for nes
	                    $scope.currentSchedule={};//for update
	                    $scope.visibleModal=false;
	                }else{
	                    showMessage("Niet alles is ingevuld","");
	                }



	            });
	        }


	    };

	    $scope.remove=function(item,index){
	        $.ajax({
	            url: "/api/schedule/remove",
	            type: "post",
	            data: {ruleID:item.ruleID}
	        }).done(function( data ) {
	            //done
	            if(data.success){
	                showMessage(item.name + " is verwijderd",'');
	                $(".items div#" + index).css("animation"," remove 0.4s linear forwards");
	                setTimeout(function(){
	                    $(".items div#" + index).css('display','none');
	                    //reset();
	                    //$scope.getSchedules();
	                }, 400);

	            }else{
	                showMessage("Niet alles is ingevuld","");
	            }



	        });


	    };



	    $socket.on('connect', function (msg) {
	        $socket.emit('load_status', true);
	    });



	    $scope.load();
	};

	//with webpack
	app.controller("scheduleController", ['$scope', '$rootScope', '$http', '$socket', '$window', '$location', 'md5',scheduleController]);

	module.exports=scheduleController;

	//without webpack:
	//angular.module("app").controller("liveController", ['$scope', '$rootScope', '$http', '$socket', '$window', '$location', 'md5',liveController]);


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var app         = __webpack_require__(1);

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


/***/ }
/******/ ]);