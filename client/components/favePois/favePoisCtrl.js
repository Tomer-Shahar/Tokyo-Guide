angular.module('tokyoApp').controller('favePoisCtrl', ["$scope",'favePois', 
    function($scope, favePois) {

    $scope.loggedIn = $scope.$parent.isLoggedInObject.isLogged
    $scope.reverseSort = false;

    if($scope.loggedIn){
        $scope.favePois = $scope.$parent.favePois.userFavorites
    }
 
 }]);