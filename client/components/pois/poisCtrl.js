angular.module('tokyoApp').controller('poisCtrl', ["$scope",'poiService','allPois', function($scope, poiService, allPois) {
    
    $scope.loggedIn = $scope.$parent.isLoggedInObject.isLogged
    $scope.reverseSort = false;
    $scope.faveList = {};
    $scope.pois = allPois.POIs

    // Simulate a list of faves
    $scope.favePois = [
        {
            "name": "Akiba",
            "category": "electronics",
            "views": 30,
            "rating": 4.5,
            "PID": "1",
        },
        {
            "name": "gasddw",
            "category": "shrines",
            "views": 90,
            "rating": 4,
            "PID": "3",
        }
    ]

    //Save which of the POIs are favorites or not
    $scope.calcFaves = function(){
        for(poi of $scope.pois){
            $scope.faveList[poi.PID] = false; //init all values with false.
           // poi.Rating = poi.Rating.substring(0,4)
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
