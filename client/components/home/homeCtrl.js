angular.module('tokyoApp').controller('homeCtrl', ["$scope", 'randomPois','poiService', function($scope, randomPois, poiService) {

    $scope.Pois = randomPois.POIs
    $scope.faveList = {}
    
    var path = "resources/images/poi/"
    $scope.img0 = path + $scope.Pois[0].Image
    $scope.img1 = path + $scope.Pois[1].Image
    $scope.img2 = path + $scope.Pois[2].Image
    $scope.imgs = [ $scope.img0, $scope.img1, $scope.img2 ]; //Useful for poi modals

    $scope.currPoi = 0;
    $scope.currImg = $scope.img0

    $scope.poiReviews = [0, 0, 0];
    $scope.userReview = [false, false, false]
    $scope.loggedIn = $scope.$parent.isLoggedInObject.isLogged //getlogged in property from parent

    $scope.showReview = false
    $scope.flipReview = function(){
      $scope.showReview = !$scope.showReview
    }

    $scope.calcFaves = function(){
      for(fave of $scope.favePois){
          $scope.faveList[fave.PID] = true; //change fave ones to true.         
      }
  }

  $scope.calcFaves();

  $scope.icreaseFaveCount = function(){
      $scope.faveCounter = $scope.faveCounter + 1
  }

  $scope.unFave = function(poi){
    if($scope.$parent.unFave(poi)){
      $scope.faveList[poi.PID] = false;
    }
  }

  $scope.addToFave = function(poi){
    $scope.$parent.addToFave(poi);
    $scope.faveList[poi.PID] = true;
  }

    $scope.setCurrPoi = function(num){
      $scope.currPoi = num;
      $scope.currImg = $scope.imgs[num]
      $scope.showReviewError = false;
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
      $scope.showReviewError = false;
      $scope.userReview[$scope.currPoi] = false;
      rankObj = {id: $scope.Pois[$scope.currPoi].PID, ranking: $scope.poiRating}
      var ranking = poiService.postRank(rankObj)
      ranking.then(function(result){
        debugger;
          if(result.status === 200){
            if($scope.textReview !== undefined){
              reviewObj = {id: $scope.Pois[$scope.currPoi].PID, description: $scope.textReview}
              var review = poiService.postReview(reviewObj)
              review.then(function(result){
                  if(result.status === 200){ //succeeded ranking AND text reviewing
                    $scope.userReview[$scope.currPoi] = true
                    $scope.showReviewError = true;
                    $scope.poiRating = 1
                    $scope.textReview = ""
                  }
                  else{ //text review failed
                    $scope.reviewErrorMessage = result.data.message
                    $scope.showReviewError = true;
                  }
              });
            }
            else{ // No text review, success
              $scope.userReview[$scope.currPoi] = true
              $scope.showReviewError = false;
              $scope.poiRating = 1
              $scope.textReview = ""
            }
          }
          else{ //ranking failed
            $scope.reviewErrorMessage = result.data.message
            $scope.showReviewError = true;
          }
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

    /* Go to michelin star link - doesn't work (?)*/
    $scope.followLink = function(){
      $location = "https://www.telegraph.co.uk/travel/food-and-wine-holidays/cities-with-the-most-michelin-stars/tokyo/"
    }
}]);