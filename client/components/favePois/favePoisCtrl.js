angular.module('tokyoApp').controller('favePoisCtrl', ["$scope",'favePois', 
    function($scope, favePois) {

    $scope.loggedIn = $scope.$parent.isLogged
    $scope.favePois = favePois
    console.log(favePois)
    $scope.openPoi = function(){
        
    }

 
 }]);