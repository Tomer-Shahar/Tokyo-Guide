angular.module('tokyoApp').controller('aboutCtrl', ["$scope", 'randomPois','poiService', 
    function($scope, randomPois, poiService) {

        $scope.Pois = randomPois.POIs
        $scope.currPoi = $scope.Pois[0] // The POI shown in the modal will be stored here.
        $scope.poiReviews = []
        $scope.showReview = false
        $scope.faveList = {}
        $scope.poiReviews = [0, 0, 0];
        $scope.userReview = {}
        $scope.loggedIn = $scope.$parent.isLoggedInObject.isLogged 


        $scope.setCurrPoi = function(poi){
            $scope.currPoi = poi;
            var review = poiService.getNewReviews(poi.PID)
            $scope.showReviewError = false;
            $scope.poiRating = 1
            $scope.textReview = undefined
            review.then(function(result){
                $scope.poiReviews[poi.PID] = result;
                $scope.poiReviews[poi.PID][0].Date =  $scope.poiReviews[poi.PID][0].Date.substring(0,10);
                $scope.poiReviews[poi.PID][1].Date =  $scope.poiReviews[poi.PID][1].Date.substring(0,10);
            });
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
            $scope.faveList[poi.PID] = false;
        }
      
        $scope.addToFave = function(poi){
            $scope.faveList[poi.PID] = true;
            poiService.addToFavorites($scope.userName, poi.PID)
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
                          $scope.userReview[currPoi.PID] = true
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

        $scope.flipReview = function(){
          $scope.showReview = !$scope.showReview
        }
    }
]);