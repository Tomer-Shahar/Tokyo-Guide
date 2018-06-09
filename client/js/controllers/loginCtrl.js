angular.module('tokyoApp').controller('loginCtrl', ["$scope", "$location", function($scope, $location) {

    $scope.userName = "Guest"
    $scope.loggedIn = "false"
    $scope.forgotPassword= "false"
    $scope.userVerified = "false"
    $scope.isVisible = "true";
    
    $scope.submit = function() {
        $location.path("/success-sign-up");
      };
    
    $scope.verifyUserName = function(){
        console.log("verifying username..")
    }
}]);