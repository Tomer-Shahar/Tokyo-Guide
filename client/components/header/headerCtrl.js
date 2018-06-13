angular.module('tokyoApp').controller('headerCtrl', ["$scope", "$location",'$http','loginService', function($scope, $location, $http, loginService) {

    $scope.userName = "Guest"

}]);