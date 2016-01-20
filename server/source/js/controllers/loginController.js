var app = require('../angular_app');

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
