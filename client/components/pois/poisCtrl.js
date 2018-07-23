angular.module('tokyoApp').controller('poisCtrl', ["$scope",'poiService','allPois', '$timeout',
    function($scope, poiService, allPois, $timeout) {
    
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

    var poisMap = L.map('poisMap').setView([35.6896, 139.6921],8);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox.streets'
      }).addTo(poisMap);
    var layer = L.marker([35.6896, 139.6921]).addTo(poisMap).bindPopup('Tokyo City Center').openPopup();
    layer.addTo(poisMap)


    if($scope.loggedIn){
        $scope.favePois = $scope.$parent.favePois
    }
    
    //Save which of the POIs are favorites or not
    $scope.calcFaves();

    $scope.setCurrPoi = function(poi){
        $scope.incrementViews(poi);
        $scope.currPoi = poi;
        $scope.setCoordinates(poi)
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

    $scope.clearForm = function(){
      $scope.showReviewError = false;
      $scope.poiRating = 1;
      $scope.textReview = undefined;
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
              if($scope.textReview !== undefined ){
                reviewObj = {id: $scope.currPoi.PID, description: $scope.textReview}
                var review = poiService.postReview(reviewObj)
                review.then(function(result){
                    if(result.status === 200){ //succeeded ranking AND text reviewing
                      $scope.userReview[$scope.currPoi.PID] = true
                      $scope.showReviewError = false
                      $scope.poiRating = undefined
                      $scope.textReview = undefined
                      var review = poiService.getNewReviews($scope.currPoi.PID)
                      review.then(function(result){
                          $scope.poiReviews[$scope.currPoi.PID] = result;
                          $scope.poiReviews[$scope.currPoi.PID][0].Date =  $scope.poiReviews[$scope.currPoi.PID][0].Date.substring(0,10);
                          $scope.poiReviews[$scope.currPoi.PID][1].Date =  $scope.poiReviews[$scope.currPoi.PID][1].Date.substring(0,10);
                      });
                    }
                    else{ //text review failed
                      $scope.reviewErrorMessage = result.data.message
                      $scope.showReviewError = true;
                    }
                });
              }
              else{ // No text review, success
                $scope.userReview[$scope.currPoi.PID] = true
                $scope.showReviewError = false
                $scope.poiRating = undefined
                $scope.textReview = undefined
              }
            }
            else{ //ranking failed
              $scope.reviewErrorMessage = result.data.message
              $scope.showReviewError = true
            }
        });
      }

    $scope.flipReview = function(){
      $scope.showReview = !$scope.showReview
    }

    $scope.unFave = function(poi){
        $scope.faveList[poi.PID] = false;
        $scope.$parent.unFave(poi);
    }

    $scope.addToFave = function(poi){
        $scope.$parent.addToFave(poi);
        $scope.faveList[poi.PID] = true;
    }

    $scope.setCoordinates = function(poi){
      let x = poi.XCoordinate
      let y = poi.YCoordinate
      poisMap.setView([x, y],10);
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
        }).addTo(poisMap);
        layer.remove()
        layer = L.marker([x, y]).addTo(poisMap).bindPopup(poi.Name);

        $timeout(function(){
          poisMap.invalidateSize();
          },
        400)
    }

    $scope.calcFaves();

    // Deals with the problem of a modal on top of another modal
    //When closing 2nd modal, will return focus to first
    $('#reviewModal').on('hidden.bs.modal', function (e) {
      console.log('Modal is successfully shown!');
      $('body').addClass('modal-open')
    }); 

 }]);
