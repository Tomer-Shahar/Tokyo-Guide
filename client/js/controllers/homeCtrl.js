angular.module('tokyoApp').controller('homeCtrl', ["$scope", function($scope) {

    var carouselEl = angular.element(document.querySelector('#myCarousel'))

    $scope.name = "Tom2"

    $scope.prev = function() {
      carouselEl.carousel('prev')
    }
    $scope.next = function() {
      carouselEl.carousel('next')
    }

}]);