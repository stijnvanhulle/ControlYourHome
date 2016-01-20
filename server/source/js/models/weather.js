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