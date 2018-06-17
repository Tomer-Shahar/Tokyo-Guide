angular.module('tokyoApp').controller('indexCtrl', ["$scope", 'loginService', 'poiService',
    function($scope, loginService, poiService) {

        $scope.loginService = loginService;
        $scope.isLoggedInObject = {
            isLogged: false,
            firstName: "Guest"
        };
        $scope.favePois = []

        $scope.$watch('loginService.isLoggedInObject', (newvalue, oldValue) => { //logged in or logged out will be caught here
            if(newvalue !== undefined){
                $scope.isLoggedInObject.isLogged = newvalue.isLoggedin;
                $scope.isLoggedInObject.firstName = newvalue.firstName;
            }
            if($scope.isLoggedInObject.isLogged){
                var faves = poiService.getFavoritePois()
                faves.then(function(result){
                    if(result.status === 200){
                        $scope.favePois = result.data.userFavorites
                        $scope.faveCounter = $scope.favePois.length
                    }
                    else{
                        console.log("Couldnt get favorite POIs.")
                    }
                });
            } 
        })

        $scope.logOut = function(){
            loginService.logout();
        }

        $scope.unFave = function(poi){
            let removeObj = {"id": poi.PID};
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
        
          $scope.addToFave = function(poi){
            let addObj = {"id": poi.PID};
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
    }
]);