var app = angular.module('tokyoApp', ['ngRoute', 'ngAnimate']);

    app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider)  {

        $locationProvider.hashPrefix('');

        $routeProvider
        .when("/home", {
          templateUrl: "views/home.html",
          controller: "homeCtrl"
        })
        .otherwise({ redirectTo: "/home" });
    }]);