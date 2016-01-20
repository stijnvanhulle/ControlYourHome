//stijn van hulle controllers
var routes      = require('./libs/routes');


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