angular.module('tokyoApp').controller('indexCtrl', ["$scope", 'loginService', 'poiService',
    function($scope, loginService, poiService) {

        $scope.loginService = loginService;
        $scope.isLoggedInObject = {
            isLogged: false,
            firstName: "Guest",
            favePois: {}
        };
        $scope.favePois = {} //An updated dict of all favorites
        $scope.deletedPois = {} //A dict of all pois deleted this session
        $scope.addedPois = {} //A dict of all pois added this session
        $scope.updateSuccess = false;
        $scope.faveList = {}

        $scope.$watch('loginService.isLoggedInObject', (newvalue, oldValue) => { //logged in or logged out will be caught here
            if(newvalue !== undefined){
                $scope.isLoggedInObject.isLogged = newvalue.isLoggedin;
                $scope.isLoggedInObject.firstName = newvalue.firstName;
                $scope.favePois = newvalue.favePois
            }
            if($scope.favePois !== undefined){
                $scope.faveCounter = Object.keys($scope.favePois).length;
            } 
        })
        $scope.unFave = function(poi){
            delete $scope.favePois[poi.PID] //remove from faves
            $scope.deletedPois[poi.PID] = poi //add to deleted dict
            if(poi.PID in $scope.addedPois){
                delete $scope.addedPois[poi.PID] //if it was added before, remove
            }
            poiService.updateLocalFaves($scope.favePois) //update local storage
            $scope.faveCounter -= 1
        }

        $scope.addToFave = function(poi){
            $scope.favePois[poi.PID] = poi //add to faves
            $scope.addedPois[poi.PID] = poi //add to added pois
            if(poi.PID in $scope.deletedPois){
                delete $scope.deletedPois[poi.PID] //if it was deleted before, remove it
            }
            poiService.updateLocalFaves($scope.favePois) //update local storage
            $scope.faveCounter += 1 
        }

        $scope.saveFaves = function(){
            debugger;
            poiService.updateDatabaseFaves($scope.addedPois, $scope.deletedPois)
        }

        $scope.calcFaves = function(){
            for(const favePID in $scope.favePois){
                if( $scope.favePois.hasOwnProperty(favePID)){
                    $scope.faveList[favePID] = true; //insert true for fave ones     
                }
            }
        }

        $scope.incrementViews = function(poi){
            poiService.incrementViews(poi.PID);
        }
    
        $scope.logOut = function(){
            loginService.logout();
        }
    }
]);

        /*
        $scope.unFave = function(poi){
            let removeObj = {id: poi.PID};
            var removeResult = poiService.deleteFavePoi(removeObj)
            removeResult.then(function(result){
                if(result.status === 200){
                    $scope.faveCounter -= 1
                    return true
                }
                else{
                    console.log("Didn't remove from favorites.")
                    return false
                }
            });
          } 
          
        $scope.updateDatabaseFaves = function(){
            let addObj = {id: poi.PID};
            var addResult = poiService.addFavePoi(addObj)
            addResult.then(function(result){
                if(result.status === 200){
                    $scope.faveCounter += 1
                    return true
                }
                else{
                    console.log("Didn't add to favorites.")
                    return false
                }
            });
        }
          */

        /*
        $scope.submitReview = function(poi, ratingObj){
            let resultObj = {
                showReviewError: false,
                userReviewed: true, //change to false if there's an error
                reviewErrorMessage: "",
                rank: ratingObj.rank,
                textReview: ratingObj.textReview //change to "" if succeeded
            };
            
            if(ratingObj.rank !== undefined){
                debugger;
                rankObj = {id: poi.PID, ranking: ratingObj.rank}
                var ranking = poiService.postRank(rankObj)
                ranking.then(function(result){
                    if(result.status === 200){
                        resultObj.rank = 1
                    }
                    else{
                        resultObj.reviewErrorMessage = result.data.message;
                        resultObj.showReviewError = true;
                        resultObj.userReviewed = false;
                    }
                });
            }
            if(ratingObj.textReview !== undefined){
                debugger;
                reviewObj = {id: poi.PID, description: ratingObj.textReview}
                var review = poiService.postReview(reviewObj)
                review.then(function(result){
                    if(result.status === 200){ //succeeded text reviewing
                        resultObj.textReview = ""
                    }
                    else{
                        resultObj.reviewErrorMessage = result.data.message;
                        resultObj.showReviewError = true;
                        resultObj.userReviewed = false;
                    }
                });
            }
          }
          */