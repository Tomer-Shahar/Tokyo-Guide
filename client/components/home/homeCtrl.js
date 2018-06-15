angular.module('tokyoApp').controller('homeCtrl', ["$scope", 'randomPois','poiService', function($scope, randomPois, poiService) {

    $scope.Pois = randomPois.POIs
    
    var path = "resources/images/poi/"
    $scope.img0 = path + $scope.Pois[0].Image
    $scope.img1 = path + $scope.Pois[1].Image
    $scope.img2 = path + $scope.Pois[2].Image
    $scope.imgs = [ $scope.img0, $scope.img1, $scope.img2 ]; //Useful for poi modals

    $scope.currPoi = 0;
    $scope.currImg = $scope.img0

    $scope.poiReviews = [0, 0, 0];
    $scope.loggedIn = $scope.$parent.isLogged //getlogged in property from parent

    $scope.showReview = false
    $scope.flipReview = function(){
      $scope.showReview = !$scope.showReview
    }

    $scope.followLink = function(){
      $location = "https://www.telegraph.co.uk/travel/food-and-wine-holidays/cities-with-the-most-michelin-stars/tokyo/"
    }

    $scope.setCurrPoi = function(num){
      $scope.currPoi = num;
      $scope.currImg = $scope.imgs[num]
      if($scope.poiReviews[num] === 0){  //To not get the same review twice
        var review = poiService.getNewReviews($scope.Pois[num].PID)
        review.then(function(result){
            $scope.poiReviews[num] = result;
            $scope.poiReviews[num][0].Date =  $scope.poiReviews[num][0].Date.substring(0,10);
            $scope.poiReviews[num][1].Date =  $scope.poiReviews[num][1].Date.substring(0,10);
        });
      }
    }

    $scope.submitReview = function(){
      alert("Review for POI number " + $scope.Pois[$scope.currPoi].PID + " -->  Rating: " + $scope.poiRating +" Description: " + $scope.textReview);
      $scope.poiRating = 0
      $scope.textReview = ""
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