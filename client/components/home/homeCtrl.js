angular.module('tokyoApp').controller('homeCtrl', ["$scope", function($scope) {

    var carouselEl = angular.element(document.querySelector('#myCarousel'))

    $scope.prev = function() {
      carouselEl.carousel('prev')
    }
    $scope.next = function() {
      carouselEl.carousel('next')
    }

    $scope.followLink = function(){
      $location = "https://www.telegraph.co.uk/travel/food-and-wine-holidays/cities-with-the-most-michelin-stars/tokyo/"
    }

}]);