var app = require('../angular_app');

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
