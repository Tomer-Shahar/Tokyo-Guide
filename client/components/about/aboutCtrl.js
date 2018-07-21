angular.module('tokyoApp').controller('aboutCtrl', ["$scope", 'randomPoiService','poiService', '$timeout',
    function($scope, randomPoiService, poiService, $timeout) {

        var random = randomPoiService.getRandomPoi(6);
        random.then(function(result){
          $scope.Pois = result
          $scope.currPoi = $scope.Pois[0];
        })

        $scope.poiReviews = {}
        $scope.showReview = false
        $scope.faveList = {}
        $scope.poiReviews = {};
        $scope.userReview = {}
        $scope.loggedIn = $scope.$parent.isLoggedInObject.isLogged 

        var cardMap = L.map('cardMap').setView([35.6896, 139.6921],8);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox.streets'
            }).addTo(cardMap);
          var layer = L.marker([35.6896, 139.6921]).addTo(cardMap).bindPopup('Tokyo City Center').openPopup();
          layer.addTo(cardMap)

        $scope.setCurrPoi = function(poi){
            $scope.currPoi = poi;
            $scope.setCoordinates($scope.currPoi)
            $scope.incrementViews(poi);
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
      
        $scope.calcFaves();
            
        $scope.unFave = function(poi){
            $scope.$parent.unFave(poi)
            $scope.faveList[poi.PID] = false;
        }
      
        $scope.addToFave = function(poi){
            $scope.$parent.addToFave(poi)
            $scope.faveList[poi.PID] = true;
        }
        
        $scope.clearForm = function(){
            $scope.showReviewError = false
            $scope.poiRating = 1
            $scope.textReview = undefined
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
                        else{ //text review failed
                          $scope.reviewErrorMessage = result.data.message
                          $scope.showReviewError = true
                        }
                    });
                  }
                  else{ // No text review, success
                    $scope.userReview[$scope.currPoi.PID] = true
                    $scope.showReviewError = false
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

        $scope.setCoordinates = function(poi){
            let x = poi.XCoordinate
            let y = poi.YCoordinate
           // mymap = L.map('homeMap').setView([x, y],8);
            cardMap.setView([x, y],10);
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
              maxZoom: 18,
              attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                  '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                  'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
              id: 'mapbox.streets'
              }).addTo(cardMap);
              layer.remove()
              layer = L.marker([x, y]).addTo(cardMap).bindPopup(poi.Name);
      
              $timeout(function(){
                cardMap.invalidateSize();
                },
              400)
          }
    }
]);