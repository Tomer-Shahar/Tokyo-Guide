angular.module('tokyoApp').controller('loginCtrl', ["$scope", "$location",'$http','loginService', function($scope, $location, $http, loginService) {

    $scope.userName = "Guest"
    $scope.loggedIn = false
    $scope.forgotPassword= false
    $scope.userVerified = false
    
    $scope.submit = function() {
        $location.path("/success-sign-up");
      };
    
    $scope.verifyUserName = function(){
        //Verify the username with the server..
        $scope.userVerified = !$scope.userVerified
    }

    $scope.login = function () {
        // register user
        console.log($scope.user)
        loginService.login($scope.user)
    }
}]);