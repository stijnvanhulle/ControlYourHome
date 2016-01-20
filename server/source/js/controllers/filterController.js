var app = require('../angular_app');

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

