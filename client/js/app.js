var app = angular.module('tokyoApp', ["ngRoute"]);

    app.config(['$locationProvider', '$routeProvider', 
        function($locationProvider, $routeProvider)  {


        $locationProvider.hashPrefix('');
    
    
        $routeProvider
        .when("/home", {
          templateUrl: "views/home.html",
          controller: "homeCtrl"
        })
        .when("/register", {
          templateUrl: "views/register.html",
          controller: "registerCtrl"
        })
        .when("/success-sign-up", {
          templateUrl: "views/success-sign-up",
          controller: "success-sign-upCtrl successCtrl"
        })
        .when("/contact-success", {
          templateUrl: "views/contact-success.html",
          controller: "contactController as conCtrl"
        })
        .otherwise({
          redirectTo: "/home"
        });
    }
  ]);