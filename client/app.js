var app = angular.module('tokyoApp', ['ngRoute', 'ngAnimate','LocalStorageModule',"pathgather.popeye"]);

    app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider)  {

        $locationProvider.hashPrefix('');

        $routeProvider
        .when("/home", {
          templateUrl: "components/home/home.html",
          controller: "homeCtrl",
          resolve: {
            randomPois: function(randomPoiService){
              return randomPoiService.getRandomPoi(3);
            }
          }
        })
        .when("/pois", {
            templateUrl: "components/pois/pois.html",
            controller: "poisCtrl",
            /*resolve: {
              allPois: function(poiService){
                console.log("in the resolve")
                return poiService.getAllPoi();
              }
            } */
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
          .when("/favePois", {
            templateUrl: "components/favePois/favePois.html",
            controller: "favePoisCtrl",
            resolve: {
              message: function(poiService){
                return poiService.getFavoritePois();
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
          .when("/admin", {
            templateUrl: "components/admin/admin.html",
            controller: "adminCtrl",
            resolve: {
              data: (adminService) => {
                return adminService.getAdminData();
              }
            }
          })
          .when("/about", {
            templateUrl: "components/about/about.html",
            controller: "aboutCtrl",
            resolve: {
              randomPois: function(randomPoiService){
                return randomPoiService.getRandomPoi(6);
              }
            }
          })
        .otherwise({ redirectTo: "/home" });

    }]);