angular.module('tokyoApp').controller('indexCtrl', ["$scope", 'loginService',
    function($scope, loginService) {

        //$scope.userName = loginService.firstName;
        $scope.userName = "Guest"
        $scope.isLogged = true //loginService.loggedIn; //change according to service
        $scope.faveCounter = 8
        $scope.isAdmin = true

        $scope.popup = function(){
           console.log("indexCtrls username: " + $scope.userName)
           console.log("But the service username is: " + loginService.firstName)
        }

        $scope.icreaseFaveCount = function(){
            $scope.faveCounter = $scope.faveCounter + 1
        }
    }
]);