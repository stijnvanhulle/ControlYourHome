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