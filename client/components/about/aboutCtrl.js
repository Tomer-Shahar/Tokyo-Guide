angular.module('tokyoApp').controller('aboutCtrl', ["$scope", 'randomPois',
    function($scope, randomPois) {

        $scope.Pois = randomPois.POIs

    }
]);