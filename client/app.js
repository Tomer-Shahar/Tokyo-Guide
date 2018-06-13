var app = angular.module('tokyoApp', ['ngRoute', 'ngAnimate','LocalStorageModule']);

    app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider)  {

        $locationProvider.hashPrefix('');

        $routeProvider
        .when("/", {
          templateUrl: "components/home/home.html",
          controller: "homeCtrl"
        })
        .when("/pois", {
            templateUrl: "components/pois/pois.html",
            controller: "poisCtrl",
          })
          .when("/register", {
            templateUrl: "components/register/register.html",
            controller: "registerCtrl",
            resolve: {
              message: function(registerService){
                return registerService.getRegisterParams();
              }
            }
          })
          .when("/login", {
            templateUrl: "components/login/login.html",
            controller: "loginCtrl"
          })
          .when("/success-sign-up", {
            templateUrl: "components/success-sign-up/success-sign-up.html",
            controller: "loginCtrl"
          })
          .when("/restorePassword", {
            templateUrl: "components/restorePassword/restorePassword.html",
            controller: "loginCtrl"
          })
        .otherwise({ redirectTo: "/" });

    }]);