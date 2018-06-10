angular.module('tokyoApp').controller('loginCtrl', ["$scope", "$location", function($scope, $location) {

    $scope.userName = "Guest"
    $scope.loggedIn = false
    $scope.forgotPassword= false
    $scope.userVerified = false
    
    $scope.submit = function() {
        $location.path("/success-sign-up");
      };
    
    $scope.verifyUserName = function(){
        //Verify the username with the server..2
        $scope.userVerified = !$scope.userVerified
    }
}]);