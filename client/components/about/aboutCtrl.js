angular.module('tokyoApp').controller('aboutCtrl', ["$scope", 'randomPois','poiService', 
    function($scope, randomPois, poiService) {

        $scope.Pois = randomPois.POIs
        $scope.currPoi = $scope.Pois[0] // The POI shown in the modal will be stored here.
        $scope.loggedIn = $scope.$parent.isLogged //getlogged in property from parent
        $scope.poiReviews = []
        $scope.showReview = false

        $scope.setCurrPoi = function(poi){
            $scope.currPoi = poi;
            var review = poiService.getNewReviews(poi.PID)
            review.then(function(result){
                $scope.poiReviews[poi.PID] = result;
                $scope.poiReviews[poi.PID][0].Date =  $scope.poiReviews[poi.PID][0].Date.substring(0,10);
                $scope.poiReviews[poi.PID][1].Date =  $scope.poiReviews[poi.PID][1].Date.substring(0,10);
            });
        }

        $scope.submitReview = function(){
            alert("Review for POI number " + $scope.currPoi.PID + " -->  Rating: " + $scope.poiRating +" Description: " + $scope.textReview);
            $scope.poiRating = 0
            $scope.textReview = ""
        }

        $scope.flipReview = function(){
          $scope.showReview = !$scope.showReview
        }
    }
]);