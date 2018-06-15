angular.module('tokyoApp').controller('favePoisCtrl', ["$scope","$http", function($scope,$http, Popeye) {

    $scope.openPoi = function(){
        
    }

 
 }]);


     /* Open a modal to show the selected user profile
    $scope.openPoi = function() {
        console.log("entered openPoi")

        var modal = Popeye.openModal({
         templateUrl: "poi_modal.html",
         resolve: {
            poi: function($http) {
              return $http.get("http://localhost:3000/api/guests/poiRand/1/0");
            }
          }
        });

        console.log("finished doing the control thing")
    
        // Show a spinner while modal is resolving dependencies
        $scope.showLoading = true;
        modal.resolved.then(function() {
          $scope.showLoading = false;
        });
    
        // Update user after modal is closed
        modal.closed.then(function() {
          $scope.updateUser();
        });
      }; */