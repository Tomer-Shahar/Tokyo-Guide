var app = angular.module('tokyoApp', ['ngRoute', 'ngAnimate','LocalStorageModule',"pathgather.popeye"]);

    app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider){

        $locationProvider.hashPrefix('');

        $routeProvider
        .when("/home", {
          templateUrl: "components/home/home.html",
          controller: "homeCtrl",
        })
        .when("/pois", {
            templateUrl: "components/pois/pois.html",
            controller: "poisCtrl",
            resolve: {
              allPois: function(poiService){
                return poiService.getAllPoi();
              }
            }
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
           /* resolve: { //We do it like so because we want the fave page to correctly display the order.
              order: function(orderService){
                return orderService.getUserOrder();
              }
            } */
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
          })
        .otherwise({ redirectTo: "/home" });

    }]);

    app.directive('poiModal', function(){
      return{
        restrict: 'EA',
        scope:{
          handler: '=lolo'
        },
        templateUrl: 'components/modal/poiModal.html',
        transclude: true,
        controller: function($scope){
          $scope.handler = 'pop';
        },
      };
    });