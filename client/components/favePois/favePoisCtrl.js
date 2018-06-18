angular.module('tokyoApp').controller('favePoisCtrl', ["$scope",'poiService',
    function($scope, poiService) {
    
    $scope.loggedIn = $scope.$parent.isLoggedInObject.isLogged
    $scope.reverseSort = false;
    $scope.showReview = false
    $scope.poiReviews = {};
    $scope.userReview = {}
    $scope.favePoisArray = []

    //Save which of the POIs are favorites or not
    $scope.calcFaves();

    $scope.createFaveArray = function() {
      for(const favePID in $scope.favePois){
        if( $scope.favePois.hasOwnProperty(favePID)){
            $scope.favePoisArray.push( $scope.favePois[favePID]);
        }
      }
    }

  $scope.createFaveArray();
  $scope.currPoi = $scope.favePoisArray[0] // The POI shown in the modal will be stored here.

    $scope.saveChanges = function(){
        $scope.$parent.saveFaves()
        $scope.saved = true
    }

    $scope.setCurrPoi = function(poi){
        $scope.incrementViews(poi);
        $scope.currPoi = poi;
        $scope.showReviewError = false;
        $scope.poiRating = 1
        $scope.textReview = undefined
        var review = poiService.getNewReviews(poi.PID)
        review.then(function(result){
            $scope.poiReviews[poi.PID] = result;
            $scope.poiReviews[poi.PID][0].Date =  $scope.poiReviews[poi.PID][0].Date.substring(0,10);
            $scope.poiReviews[poi.PID][1].Date =  $scope.poiReviews[poi.PID][1].Date.substring(0,10);
        });
    }

    $scope.submitReview = function(){
      $scope.showReviewError = false;
      $scope.userReview[$scope.currPoi.PID] = false;
      rankObj = {id: $scope.currPoi.PID, ranking: $scope.poiRating}
      var ranking = poiService.postRank(rankObj)
      ranking.then(function(result){
          if(result.status === 200){
            if($scope.textReview !== undefined){
              reviewObj = {id: $scope.currPoi.PID, description: $scope.textReview}
              var review = poiService.postReview(reviewObj)
              review.then(function(result){
                  if(result.status === 200){ //succeeded ranking AND text reviewing
                    $scope.userReview[$scope.currPoi.PID] = true
                    $scope.showReviewError = true;
                    $scope.poiRating = undefined
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
              $scope.poiRating = undefined
              $scope.textReview = undefined
            }
          }
          else{ //ranking failed
            $scope.reviewErrorMessage = result.data.message
            $scope.showReviewError = true;
          }
      });
    }

    $scope.flipReview = function(){
      $scope.showReview = !$scope.showReview
    }

    $scope.unFave = function(poi){
        $scope.faveList[poi.PID] = false;
        $scope.$parent.unFave(poi);
        $scope.saved = false
    }

    $scope.calcFaves();

 }]);
