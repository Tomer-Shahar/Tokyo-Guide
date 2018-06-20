angular.module('tokyoApp').controller('homeCtrl', ["$scope", 'randomPois','poiService','$timeout', function($scope, randomPois, poiService, $timeout) {

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
    var mymap = L.map('homeMap').setView([35.6896, 139.6921],8);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox.streets'
      }).addTo(mymap);
    var layer = L.marker([35.6896, 139.6921]).addTo(mymap).bindPopup('Tokyo City Center').openPopup();
    layer.addTo(mymap)

    //If the user is logged in, get the most popular POIs and the last 2 saved POIs.
    if($scope.isLoggedInObject.isLogged){
      var popular = poiService.getPopularPoi();
      popular.then(function(result){
        if(result.status === 200){ //Got the popular Pois.
          $scope.popularPois = result.data.userOrder
        }
        else{ //text review failed
          $scope.popularPois = []
        }
      });

      var latestPois = poiService.getUsersLastFaves();
      latestPois.then(function(result){
        if(result.status === 200){ //Got the popular Pois.
          $scope.latestPois = result.data.userFavorites
        }
        else{ //text review failed
          $scope.latestPois = []
          $scope.latestPois = [$scope.Pois[0], $scope.Pois[1]]
        }
      });

      $scope.categories = {
        1 : "Sights & Landmarks",
        2 : "Concerts & Shows",
        3 : "Food & Drink",
        4 : "Nightlife"
      };
    }

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
      $scope.setCoordinates($scope.currPoi)
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

    $scope.setCurrPoiObject = function(poi){
      $scope.currPoi = poi
      $scope.setCoordinates($scope.currPoi)
      $scope.incrementViews($scope.currPoi);
      $scope.showReviewError = false;
      $scope.reviewSuccess = false;
      var review = poiService.getNewReviews(poi.PID)
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

    $scope.setCoordinates = function(poi){
      let x = poi.XCoordinate
      let y = poi.YCoordinate
     // mymap = L.map('homeMap').setView([x, y],8);
      mymap.setView([x, y],15);
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
        }).addTo(mymap);
        layer.remove()
        mymap.closePopup();
        layer = L.marker([x, y]).addTo(mymap).bindPopup(poi.Name);

        $timeout(function(){
          mymap.invalidateSize();
          },
        400)
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