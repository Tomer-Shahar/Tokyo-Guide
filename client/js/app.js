var app = angular.module('tokyoApp', ['ngRoute', 'ngAnimate']);

    app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider)  {

        $locationProvider.hashPrefix('');

        $routeProvider
        .when("/home", {
          templateUrl: "views/home.html",
          controller: "homeCtrl"
        })
        .when("/pois", {
            templateUrl: "views/pois.html",
          })
          .when("/register", {
            templateUrl: "views/register.html",
          })
          .when("/login", {
            templateUrl: "views/login.html",
            controller: "loginCtrl"
          })
        .otherwise({ redirectTo: "/home" });

    }]);