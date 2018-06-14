angular.module('tokyoApp').controller('homeCtrl', ["$scope", 'randomPois', function($scope, randomPois) {

    $scope.Pois = randomPois.POIs
    var x = $scope.Pois[0].Name
    var path = "resources/images/poi/"
    $scope.img0 = path + $scope.Pois[0].Image
    $scope.img1 = path + $scope.Pois[1].Image
    $scope.img2 = path + $scope.Pois[2].Image

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