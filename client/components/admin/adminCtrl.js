angular.module('tokyoApp').controller('adminCtrl', ["$scope", 'data' , function($scope, data) {

$scope.data = data;
console.log($scope.data);

}]);