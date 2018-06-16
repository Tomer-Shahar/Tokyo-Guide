angular.module('tokyoApp').controller('indexCtrl', ["$scope", 'loginService', 'poiService',
    function($scope, loginService, poiService) {

        $scope.faveCounter = 8
        $scope.loginService = loginService;
        $scope.isLoggedInObject = {
            isLogged: false,
            firstName: "Guest"
        };
        $scope.favePois = []

        $scope.$watch('loginService.isLoggedInObject', (newvalue, oldValue) => { //logged in or logged out will be caught here
            if(newvalue !== undefined){
                $scope.isLoggedInObject.isLogged = newvalue.isLoggedin;
                $scope.isLoggedInObject.firstName = newvalue.firstName;
            }/*
            if($scope.isLoggedInObject.isLogged){
                var faves = poiService.getFavoritePois()
                faves.then(function(result){
                    $scope.favePois = result.POIs
                }, function(response){
                    console.log("Couldn't get faves :*( ")
                });
            } */
        })

        $scope.icreaseFaveCount = function(){
            $scope.faveCounter = $scope.faveCounter + 1
        }

        $scope.logOut = function(){
            loginService.logout();
        }
    }
]);