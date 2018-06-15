angular.module('tokyoApp').controller('homeCtrl', ["$scope", 'randomPois','poiService', function($scope, randomPois, poiService) {

    $scope.Pois = randomPois.POIs
    var x = $scope.Pois[0].Name
    var path = "resources/images/poi/"
    $scope.img0 = path + $scope.Pois[0].Image
    $scope.img1 = path + $scope.Pois[1].Image
    $scope.img2 = path + $scope.Pois[2].Image

    $scope.currPoi = 0;
    $scope.poiReviews = [];
    $scope.loggedIn = $scope.$parent.isLogged //getlogged in property from parent

    $scope.followLink = function(){
      $location = "https://www.telegraph.co.uk/travel/food-and-wine-holidays/cities-with-the-most-michelin-stars/tokyo/"
    }

    $scope.setCurrPoi = function(num){
      $scope.currPoi = num;
      var review = poiService.getNewReviews($scope.Pois[num].PID)
      review.then(function(result){
          $scope.poiReviews[num] = result;
          console.log("result: " + result);
      });
    }

    /* Carousel fixing functions */

    var carouselEl = angular.element(document.querySelector('#myCarousel'))

    $scope.prev = function() {
      carouselEl.carousel('prev')
    }
    $scope.next = function() {
      carouselEl.carousel('next')
    }


}]);