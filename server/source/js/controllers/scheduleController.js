var app = require('../angular_app');

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
