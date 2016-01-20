var app = require('../angular_app');

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

