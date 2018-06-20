angular.module('tokyoApp').controller('favePoisCtrl', ["$scope",'poiService', 'orderService', 'order',
    function($scope, poiService, orderService, order) {
    
    $scope.loggedIn = $scope.$parent.isLoggedInObject.isLogged
    $scope.reverseSort = false;
    $scope.showReview = false
    $scope.poiReviews = {};
    $scope.userReview = {}
    $scope.favePoisArray = []
    if(order.status === 200)
      $scope.userOrder = order.data.userOrder
    else
      $scope.userOrder = []
    $scope.poiOrder = {} //a dictionary mapping PID to POSITION    \ 
    $scope.orderToPoi = {} //a dictionary mapping POSITION to PID  /
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

    $scope.boxClicked = function(){
      
      $scope.categories = {
        "Sights & Landmarks" : $scope.cat1,
        "Concerts & Shows" : $scope.cat2,
        "Food & Drink" : $scope.cat3,
        "Nightlife": $scope.cat4
      }
    }

    $scope.addPositions = function(){
      debugger
      for(poi in $scope.favePois){
        if(!(poi in $scope.poiOrder) ){
          let newPosition = Object.keys($scope.poiOrder).length+1
          $scope.poiOrder[poi] = newPosition
          $scope.orderToPoi[newPosition] = poi
        }
      }
      orderService.updateLocalOrder($scope.poiOrder)
    }
    
    let localOrder = orderService.getLocalOrder()

    for(poi in $scope.deletedPois){ //remove from the local Order the POIs that were deleted!
      delete localOrder[poi]
    }
    
    for(i=0; i<$scope.userOrder.length; i++){ //remove from the server's order the POIs that were deleted!
      if($scope.userOrder[i].PID in $scope.deletedPois){
        $scope.userOrder.splice(i,1)
      }
    }

    if(Object.keys(localOrder).length !== 0){ //we have a local order -> We assume local order takes preference over server order.
      $scope.poiOrder = localOrder
      for(pid in $scope.poiOrder){
        position = $scope.poiOrder[pid]
        $scope.orderToPoi[position] = pid 
      }
      $scope.addPositions(); 
    }
    else if($scope.userOrder.length !== 0){ //We DO NOT have a local order, and we received an order from the server. 
      //let orderObj = {}
      for(const fave of $scope.userOrder){ //It should iterate based on position value
        $scope.poiOrder[fave.PID] = fave.Position //We need to rearrange poiOrder to be dictionary such as { PID, position}
        $scope.orderToPoi[fave.Position] = fave.PID
      }
      $scope.addPositions(); 
      orderService.addLocalOrder($scope.poiOrder)
    }
    else{  // User has no local storage order or preferred order, assign default values
      $scope.poiOrder = {}
      let i = 1
      for(favePID in $scope.favePois){
          $scope.poiOrder[favePID] = i
          $scope.orderToPoi[i] = favePID
          i++
      }
      $scope.addPositions(); 
      orderService.addLocalOrder($scope.poiOrder)
    }
   
    $scope.order = "position"

    //Save which of the POIs are favorites or not
    $scope.calcFaves();

    $scope.createFaveArray = function() { //create an array of Pois for the ng-repeat directive
      for(const favePID in $scope.favePois){
        if( $scope.favePois.hasOwnProperty(favePID)){
          $scope.favePois[favePID].position = $scope.poiOrder[favePID]
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
        $scope.saved = false
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
        $scope.saved = false
      }
    }

    $scope.saveChanges = function(){
        $scope.$parent.saveFaves()
        if($scope.userOrder.length === 0) //DB has no order for this user
          orderService.insertServerOrder($scope.poiOrder)
        else{
          orderService.updateServerOrder($scope.poiOrder)
        }
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
      
       let deletedPoiPosition = $scope.poiOrder[poi.PID]
       for(fave of $scope.favePoisArray){ //We must decrease the position of all Pois below the one being deleted!!
         if(fave.PID !== poi.PID){
           if(fave.position > deletedPoiPosition){ //means it's below
              fave.position-- //bump it up
              $scope.poiOrder[fave.PID]--
              $scope.orderToPoi[fave.position] = fave.PID
           }
         }
       }

       delete $scope.poiOrder[poi.PID]
       delete $scope.orderToPoi[$scope.favePoisArray.length]

       let len = $scope.favePoisArray.length
        for (i=0; i<len; ++i) {
          if($scope.favePoisArray[i].PID === poi.PID){
            $scope.favePoisArray.splice(i,1)
            break;
          }
        }
        $scope.faveList[poi.PID] = false;
        $scope.$parent.unFave(poi);
        $scope.saved = false
    }

    $scope.calcFaves();

 }]);
