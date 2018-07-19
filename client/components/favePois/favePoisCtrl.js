angular.module('tokyoApp').controller('favePoisCtrl', ["$scope",'poiService', 'orderService', 'order','$timeout',
    function($scope, poiService, orderService, order, $timeout) {
    
    $scope.loggedIn = $scope.$parent.isLoggedInObject.isLogged;
    $scope.reverseSort = false;
    $scope.showReview = false;
    $scope.cat1 = true;
    $scope.cat2 = true;
    $scope.cat3 = true;
    $scope.cat4 = true;
    $scope.order = "position";
    $scope.poiReviews = {};
    $scope.userReview = {};
    $scope.favePoisArray = [];

    $scope.poiOrder = order; //a dictionary mapping PID to POSITION \ 
    $scope.orderToPoi = {}; //a dictionary mapping POSITION to PID  /
    $scope.categories = {
      "Sights & Landmarks" : true,
      "Concerts & Shows" : true,
      "Food & Drink" : true,
      "Nightlife": true
    };

    $scope.categoryNums = { //map category numbers to their names
      1 : "Sights & Landmarks",
      2 : "Concerts & Shows",
      3 : "Food & Drink",
      4 : "Nightlife"
    };

    $scope.boxClicked = function(){ //When clicked one of the checkboxes, come here
      $scope.categories = {
        "Sights & Landmarks" : $scope.cat1,
        "Concerts & Shows" : $scope.cat2,
        "Food & Drink" : $scope.cat3,
        "Nightlife": $scope.cat4
      }
    };

    $scope.update_orderToPoi = function(){
      $scope.orderToPoi = {};
      for(pid in $scope.poiOrder){
      let position = $scope.poiOrder[pid]
      $scope.orderToPoi[position] = pid
      }
    }

    $scope.update_orderToPoi();

    //Save which of the POIs are favorites or not
    $scope.calcFaves();

    $scope.createFaveArray = function() { //create an array of Pois for the ng-repeat directive
      $scope.favePoisArray = [];
      for(const favePID in $scope.favePois){
        if( $scope.favePois.hasOwnProperty(favePID)){
          $scope.favePois[favePID].position = $scope.poiOrder[favePID]
          faveCategory = $scope.favePois[favePID].CategoryID
          $scope.favePois[favePID].CategoryName = $scope.categoryNums[faveCategory]
          $scope.favePoisArray.push( $scope.favePois[favePID]);
        }
      }
    }

    $scope.createFaveArray();
    $scope.currPoi = $scope.favePoisArray[0] // The POI shown in the modal will be stored here.

    $scope.moveUp = function(poi){
      $scope.order = "position"
      if($scope.poiOrder[poi.PID] !== 1){ //top of the list -> cant move up!
        let botPosition = $scope.poiOrder[poi.PID] // The position of the poi being moved up
        let topPosition = botPosition-1 //the position of the poi above 
        let movedUp = poi.PID //the PID of the poi being moved up
        let movedDown = $scope.orderToPoi[ $scope.poiOrder[poi.PID] -1] //the PID of the poi below the one being moved down.


        $scope.poiOrder[movedUp]--
        $scope.poiOrder[movedDown]++
        $scope.orderToPoi[topPosition] = movedUp
        $scope.orderToPoi[botPosition] = movedDown

        for(favePoi of $scope.favePoisArray){
          if(favePoi.PID == movedUp){
            favePoi.position--
          }
          else if(favePoi.PID == movedDown){
            favePoi.position++
          }
        }

        orderService.updateLocalOrder($scope.poiOrder);
        $scope.$parent.disableSave = false
        $scope.$parent.saved = false
      }
    }

    $scope.moveDown = function(poi){
      $scope.order = "position"
      if($scope.poiOrder[poi.PID] !== Object.keys($scope.poiOrder).length){ //bottom of the list -> cant move down!

        let topPosition = $scope.poiOrder[poi.PID]
        let botPosition = topPosition+1
        let movedUp = $scope.orderToPoi[ $scope.poiOrder[poi.PID] +1] //the PID of the poi below the one being moved up.
        let movedDown = poi.PID //the PID of the poi being moved down

        $scope.poiOrder[movedUp]--
        $scope.poiOrder[movedDown]++
        $scope.orderToPoi[topPosition] = movedUp
        $scope.orderToPoi[botPosition] = movedDown

        for(favePoi of $scope.favePoisArray){
          if(favePoi.PID == movedUp){
            favePoi.position--
          }
          else if(favePoi.PID == movedDown){
            favePoi.position++
          }
        }

        orderService.updateLocalOrder($scope.poiOrder);
        $scope.$parent.disableSave = false
        $scope.$parent.saved = false
      }
    }

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
                    $scope.poiRating = undefined
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
      $scope.$parent.unFave(poi);
      $scope.poiOrder = orderService.getLocalOrder();
      $scope.update_orderToPoi();
      $scope.createFaveArray();
    }

    var favesMap = L.map('favesMap').setView([35.6896, 139.6921],8);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox.streets'
      }).addTo(favesMap);
    var layer = L.marker([35.6896, 139.6921]).addTo(favesMap).bindPopup('Tokyo City Center').openPopup();
    layer.addTo(favesMap)

    $scope.setCoordinates = function(poi){
      let x = poi.XCoordinate
      let y = poi.YCoordinate
      favesMap.setView([x, y],10);
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
        }).addTo(favesMap);
        layer.remove()
        layer = L.marker([x, y]).addTo(favesMap).bindPopup(poi.Name);

        $timeout(function(){
          favesMap.invalidateSize();
          },
        400)
    }

    $scope.calcFaves();
 }]);
