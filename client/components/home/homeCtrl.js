angular.module('tokyoApp').controller('homeCtrl', ["$scope", 'randomPois','poiService', function($scope, randomPois, poiService) {

    $scope.Pois = randomPois.POIs
    var path = "resources/images/poi/"
    $scope.img0 = path + $scope.Pois[0].Image
    $scope.img1 = path + $scope.Pois[1].Image
    $scope.img2 = path + $scope.Pois[2].Image
    $scope.imgs = [ $scope.img0, $scope.img1, $scope.img2 ]; //Useful for poi modals

    $scope.currPoi = $scope.Pois[0];
    $scope.currImg = $scope.img0

    $scope.poiReviews = {}
    $scope.userReview = {}

    $scope.showReview = false

    $scope.flipReview = function(){
      $scope.showReview = !$scope.showReview
    }

  $scope.calcFaves();

  $scope.unFave = function(poi){
    $scope.$parent.unFave(poi)
    $scope.faveList[poi.PID] = false;
  }

  $scope.addToFave = function(poi){
    $scope.$parent.addToFave(poi);
    $scope.faveList[poi.PID] = true;
  }

    $scope.setCurrPoi = function(num){
      $scope.currPoi = $scope.Pois[num]
      $scope.incrementViews($scope.currPoi);
      $scope.currImg = $scope.imgs[num]
      $scope.showReviewError = false;
      $scope.reviewSuccess = false;
      var review = poiService.getNewReviews($scope.Pois[num].PID)
      review.then(function(result){
          $scope.poiReviews[$scope.currPoi.PID] = result;
          $scope.poiReviews[$scope.currPoi.PID][0].Date =  $scope.poiReviews[$scope.currPoi.PID][0].Date.substring(0,10);
          $scope.poiReviews[$scope.currPoi.PID][1].Date =  $scope.poiReviews[$scope.currPoi.PID][1].Date.substring(0,10);
      });
    }

    $scope.submitReview = function(){
      $scope.showReviewError = false;
      $scope.userReview[$scope.currPoi.PID] = false;
      rankObj = {id: $scope.currPoi.PID, ranking: $scope.poiRating}
      var ranking = poiService.postRank(rankObj)
      ranking.then(function(result){
        debugger;
          if(result.status === 200){
            if($scope.textReview !== undefined){
              reviewObj = {id: $scope.Pois[$scope.currPoi].PID, description: $scope.textReview}
              var review = poiService.postReview(reviewObj)
              review.then(function(result){
                  if(result.status === 200){ //succeeded ranking AND text reviewing
                    $scope.userReview[$scope.currPoi.PID] = true
                    $scope.showReviewError = true;
                    $scope.poiRating = 1
                    $scope.textReview = undefined
                  }
                  else{ //text review failed
                    $scope.reviewErrorMessage = result.data.message
                    $scope.showReviewError = true;
                  }
              });
            }
            else{ // No text review, success
              $scope.userReview[$scope.currPoi.PID] = true
              $scope.showReviewError = false;
              $scope.poiRating = 1
              $scope.textReview = undefined
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

    /*
    $scope.submitReview = function(){
      $scope.showReviewError = false;
      rankObj = {id: $scope.currPoi.PID, ranking: $scope.poiRating}
      var ranking = poiService.postRank(rankObj)
      ranking.then(function(result){
        debugger;
          if(result.status === 200){
            if($scope.textReview !== undefined){
              reviewObj = {id: $scope.Pois[$scope.currPoi].PID, description: $scope.textReview}
              var review = poiService.postReview(reviewObj)
              review.then(function(result){
                  if(result.status === 200){ //succeeded ranking AND text reviewing
                    $scope.userReview[currPoi.PID] = true
                    $scope.showReviewError = true;
                    $scope.poiRating = 1
                    $scope.textReview = undefined
                    $scope.reviewSuccess = true;
                  }
                  else if($scope.poiRating !== undefined){ //text review failed but rating succeeded.
                    $scope.reviewErrorMessage = result.data.message + '\n'
                    $scope.showReviewError = true;
                  }
              });
            }
          }
          else if($scope.textReview !== undefined){ //ranking failed either because it was empty or the server rejected it
            reviewObj = {id: $scope.Pois[$scope.currPoi].PID, description: $scope.textReview}
            var review = poiService.postReview(reviewObj)
            review.then(function(result){
                if(result.status === 200){ //text reviewing
                  $scope.showReviewError = false;
                  $scope.poiRating = undefined
                  $scope.textReview = undefined
                }
                else{ //text review failed
                  $scope.reviewErrorMessage += result.data.message
                  $scope.showReviewError = true;
                }
            });
          }
      });
    } */