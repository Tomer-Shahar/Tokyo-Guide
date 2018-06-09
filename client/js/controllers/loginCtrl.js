angular.module('tokyoApp').controller('loginCtrl', ["$scope", "$location", function($scope, $location) {

    $scope.userName = "Guest"
    $scope.loggedIn = "false"
    
    $scope.submit = function() {
        $location.path("/success-sign-up");
      };

}]);