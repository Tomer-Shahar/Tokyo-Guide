angular.module('tokyoApp').controller('indexCtrl', ["$scope", 'loginService','$location',
    function($scope, loginService, $location) {

        //$scope.userName = loginService.firstName;
        $scope.userName = "Guest"
        $scope.isLogged = loginService.loggedIn; //change according to service
        $scope.faveCounter = 8
        $scope.isAdmin = loginService.isAdmin

        $scope.popup = function(){
           console.log("indexCtrls username: " + $scope.userName)
           console.log("But the service username is: " + loginService.firstName)
        }

        $scope.icreaseFaveCount = function(){
            $scope.faveCounter = $scope.faveCounter + 1
        }

        $scope.logOut = function(){
            loginService.logout();
        }
    }
]);