var app = angular.module('tokyoApp', ['ngRoute', 'ngAnimate']);

    app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider)  {

        $locationProvider.hashPrefix('');

        $routeProvider
        .when("/home", {
          templateUrl: "views/home.html",
          controller: "homeCtrl"
        })
        .when("/poi", {
            templateUrl: "views/poi.html",
            controller: "poiCtrl"
          })
          .when("/register", {
            templateUrl: "views/register.html",
            controller: "registerCtrl"
          })
        .otherwise({ redirectTo: "/home" });

    }]);