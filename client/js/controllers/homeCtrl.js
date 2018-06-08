angular.module('tokyoApp').controller('homeCtrl', ["$scope", function($scope) {

    var carouselEl = angular.element(document.querySelector('#myCarousel'))

    $scope.prev = function() {
      console.log('here1')
      carouselEl.carousel('prev')
    }
    $scope.next = function() {
      console.log('here2')
      carouselEl.carousel('next')
    }

}]);