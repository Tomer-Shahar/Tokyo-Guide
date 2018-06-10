angular.module('tokyoApp').controller('homeCtrl', ["$scope", function($scope) {

    var carouselEl = angular.element(document.querySelector('#myCarousel'))

    $scope.prev = function() {
      carouselEl.carousel('prev')
    }
    $scope.next = function() {
      carouselEl.carousel('next')
    }

}]);