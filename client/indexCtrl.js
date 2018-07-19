angular.module('tokyoApp').controller('indexCtrl', ["$scope", 'loginService', 'poiService', 'orderService',
    function($scope, loginService, poiService, orderService) {

        $scope.loginService = loginService;
        $scope.isLoggedInObject = {
            isLogged: false,
            firstName: "Guest",
           // favePois: {}
        };
        $scope.favePois = {} //An updated dict of all favorites
        $scope.deletedPois = {} //A dict of all pois deleted this session
        $scope.addedPois = {} //A dict of all pois added this session
        $scope.updateSuccess = false;
        $scope.faveList = {}
        $scope.serverFaveList = {} //An object that will keep the original POIs that were in the server.
        $scope.saved = false
        $scope.disableSave = true

        $scope.$watch('loginService.isLoggedInObject', (newvalue, oldValue) => { //logged in or logged out will be caught here
            if(newvalue !== undefined){
                $scope.isLoggedInObject.isLogged = newvalue.isLoggedin;
                $scope.isLoggedInObject.firstName = newvalue.firstName;
                $scope.favePois = newvalue.favePois

                for(const favePID in $scope.favePois)
                    if( $scope.favePois.hasOwnProperty(favePID))
                        $scope.serverFaveList[favePID] = true //Just to keep track of who was originally in the server.
                $scope.disableSave = true //in any case user cant save after logging in or out
            }
            if($scope.favePois !== undefined){
                $scope.faveCounter = Object.keys($scope.favePois).length;
            }
        })

        $scope.unFave = function(poi){
            delete $scope.favePois[poi.PID] //remove from faves
            $scope.faveList[poi.PID] = false;
            $scope.deletedPois[poi.PID] = poi //add to deleted dict
            if(poi.PID in $scope.addedPois){
                delete $scope.addedPois[poi.PID] //if it was added before, remove
            }
            poiService.updateLocalFaves($scope.favePois) //update local storage
            orderService.removeFromOrder(poi)
            $scope.faveCounter -= 1
            $scope.saved = false
            $scope.disableSave = false
        }

        $scope.addToFave = function(poi){
            $scope.favePois[poi.PID] = poi //add to faves
            $scope.addedPois[poi.PID] = poi //add to added pois
            if(poi.PID in $scope.deletedPois){
                delete $scope.deletedPois[poi.PID] //if it was deleted before, remove it
            }
            poiService.updateLocalFaves($scope.favePois) //update local storage
            orderService.addToOrder(poi)
            $scope.faveCounter += 1 
            $scope.saved = false
            $scope.disableSave = false
        }

        $scope.saveChanges = function(){

            //save faves
            for(pid in $scope.deletedPois){
                if(!(pid in $scope.serverFaveList))
                    delete $scope.deletedPois[pid]
            }
            for(pid in $scope.addedPois){
                if(pid in $scope.serverFaveList){
                    delete $scope.addedPois[pid]
                }
            }
            var saveFaves = poiService.updateDatabaseFaves($scope.addedPois, $scope.deletedPois)
            saveFaves.then(function(res){
                console.log(res)
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
            $scope.deletedPois = {}; //A dict of all pois deleted this session
            $scope.addedPois = {}; //A dict of all pois added this session
            $scope.updateSuccess = false;
            $scope.faveList = {};
            $scope.serverFaveList = {};
        }
    }
]);