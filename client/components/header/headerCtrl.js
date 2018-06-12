angular.module('tokyoApp').controller('headerCtrl', ["$scope", "$location",'$http','setHeadersToken', function($scope, $location, $http, setHeadersToken) {

    $scope.userName = "Guest"

}]);