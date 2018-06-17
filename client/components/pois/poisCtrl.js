angular.module('tokyoApp').controller('poisCtrl', ["$scope",'poiService','allPois', 
    function($scope, poiService, allPois) {
    
    $scope.loggedIn = $scope.$parent.isLoggedInObject.isLogged
    $scope.reverseSort = false;
    $scope.faveList = {};
    $scope.pois = allPois.POIs

    if($scope.loggedIn){
        $scope.favePois = $scope.$parent.favePois
    }
    
    //Save which of the POIs are favorites or not
    $scope.calcFaves = function(){
        for(poi of $scope.pois){
            $scope.faveList[poi.PID] = false; //init all values with false.
        }
        for(fave of $scope.favePois){
            $scope.faveList[fave.PID] = true; //change fave ones to true.         
        }
    }

    $scope.unFave = function(poi){
        $scope.faveList[poi.PID] = false;

    }

    $scope.addToFave = function(poi){
        $scope.faveList[poi.PID] = true;
        poiService.addToFavorites($scope.userName, poi.PID)
    }

    $scope.calcFaves();

 }]);
