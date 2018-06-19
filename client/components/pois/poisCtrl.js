angular.module('tokyoApp').controller('poisCtrl', ["$scope",'poiService','allPois', 
    function($scope, poiService, allPois) {
    
    $scope.loggedIn = $scope.$parent.isLoggedInObject.isLogged
    $scope.reverseSort = false;
    $scope.pois = allPois.POIs
    $scope.showReview = false
    $scope.poiReviews = {};
    $scope.userReview = {}

    $scope.currPoi = $scope.pois[0] // The POI shown in the modal will be stored here.
    
    $scope.categories = {
      "Sights & Landmarks" : true,
      "Concerts & Shows" : true,
      "Food & Drink" : true,
      "Nightlife": true
    }

    $scope.cat1 = true;
    $scope.cat2 = true;
    $scope.cat3 = true;
    $scope.cat4 = true;


    if($scope.loggedIn){
        $scope.favePois = $scope.$parent.favePois
    }
    
    //Save which of the POIs are favorites or not
    $scope.calcFaves();

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
    
    $scope.boxClicked = function(){
      $scope.categories = {
        "Sights & Landmarks" : $scope.cat1,
        "Concerts & Shows" : $scope.cat2,
        "Food & Drink" : $scope.cat3,
        "Nightlife": $scope.cat4
      }
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

    $scope.addToFave = function(poi){
        $scope.$parent.addToFave(poi);
        $scope.faveList[poi.PID] = true;
        $scope.saved = false
    }

    $scope.calcFaves();

 }]);
