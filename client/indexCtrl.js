angular.module('tokyoApp').controller('indexCtrl', ["$scope", 'loginService', 'poiService', 'orderService',
    function($scope, loginService, poiService, orderService) {

        $scope.loginService = loginService;
        $scope.isLoggedInObject = {
            isLogged: false,
            firstName: "Guest",
           // favePois: {}
        };
        $scope.favePois = {} //An updated dict of all favorites
       // $scope.deletedPois = {} //A dict of all pois deleted this session
       // $scope.addedPois = {} //A dict of all pois added this session
        $scope.updateSuccess = false;
        $scope.faveList = {}
        $scope.serverFaveList = {} //An object that will keep the original POIs that were in the server.
        $scope.saved = false
        $scope.disableSave = false;

        $scope.$watch('loginService.isLoggedInObject', (newvalue, oldValue) => { //logged in or logged out will be caught here
            if(newvalue !== undefined){
                $scope.isLoggedInObject.isLogged = newvalue.isLoggedin;
                $scope.isLoggedInObject.firstName = newvalue.firstName;
                $scope.favePois = newvalue.favePois

                for(const favePID in $scope.favePois)
                    if( $scope.favePois.hasOwnProperty(favePID))
                        $scope.serverFaveList[favePID] = true; //Just to keep track of who was originally in the server.
                if($scope.isLoggedInObject.isLogged){
                    $scope.disableSave = false;
                    $scope.saved = false;
                }       
                else{
                    $scope.disableSave = true;
                }
            }
            if($scope.favePois !== undefined){
                $scope.faveCounter = Object.keys($scope.favePois).length;
            }
        })

        $scope.unFave = function(poi){
            delete $scope.favePois[poi.PID] //remove from faves
            $scope.faveList[poi.PID] = false;
            poiService.updateLocalFaves($scope.favePois) //update local storage
            orderService.removeFromOrder(poi)
            $scope.faveCounter -= 1
            $scope.saved = false
            $scope.disableSave = false
        }

        $scope.addToFave = function(poi){
            $scope.favePois[poi.PID] = poi //add to faves
            poiService.updateLocalFaves($scope.favePois) //update local storage
            orderService.addToOrder(poi)
            $scope.faveCounter += 1 
            $scope.saved = false
            $scope.disableSave = false
        }

        $scope.saveChanges = function(){
            var saveFaves = poiService.updateDatabaseFaves()
            saveFaves.then(function(res){ //Only enter once the DB has been updated.
                poiService.getFavoritePois(); //We do this to have the most up-to-date favorite Pois from the server.
                console.log("Saved favorites Successfully")
                console.log("Saved POIs:")
                console.log($scope.favePois)
                var saveSuccess = orderService.updateServerOrder(); //ToDo: Must execute this only after all favorites have been updated!!!!
                saveSuccess.then(function(res){
                    $scope.saved = true
                    $scope.disableSave = true
                })
            })
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
            $scope.cleanDictionaries(); //An object that will keep the original POIs that were in the server.
        }

        $scope.cleanDictionaries = function () {
            $scope.faveList = {};
            $scope.favePois = {}; //An updated dict of all favorites
            $scope.updateSuccess = false;
            $scope.faveList = {};
            $scope.serverFaveList = {};
        }

        

    }
]);