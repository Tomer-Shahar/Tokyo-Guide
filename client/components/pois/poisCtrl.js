angular.module('tokyoApp').controller('poisCtrl', ["$scope",'poiService'/*,'allPois'*/, function($scope, poiService/*, allPois*/) {
    
    $scope.loggedIn = $scope.$parent.isLogged;
    $scope.reverseSort = false;
    $scope.faveList = {};

    //simulate getting POIs from server
    $scope.pois = [
        {
            "name": "Akiba",
            "category": "electronics",
            "views": 30,
            "rating": 4.5,
            "PID": "1",
        },
        {
            "name": "Bahd",
            "category": "electronicsdsadd",
            "views": 320,
            "rating": 2,
            "PID": "2",
        },
        {
            "name": "gasddw",
            "category": "shrines",
            "views": 90,
            "rating": 4,
            "PID": "3",
        },
        {
            "name": "zenzen",
            "category": "goop",
            "views": 800,
            "rating": 4.8,
            "PID": "4",
        }
    ]

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
    }

    $scope.calcFaves();
 

 }]);
