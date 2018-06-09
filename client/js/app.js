var app = angular.module('tokyoApp', ['ngRoute', 'ngAnimate']);

    app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider)  {

        $locationProvider.hashPrefix('');

        $routeProvider
        .when("/", {
          templateUrl: "views/home.html",
          controller: "homeCtrl"
        })
        .when("/pois", {
            templateUrl: "views/pois.html",
            controller: "poisCtrl"
          })
          .when("/register", {
            templateUrl: "views/register.html",
            controller: "registerCtrl"
          })
          .when("/login", {
            templateUrl: "views/login.html",
            controller: "loginCtrl"
          })
          .when("/success-sign-up", {
            templateUrl: "views/success-sign-up.html",
            controller: "loginCtrl"
          })
        .otherwise({ redirectTo: "/" });

    }]);