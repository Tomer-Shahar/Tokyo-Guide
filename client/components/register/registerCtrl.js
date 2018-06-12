angular.module('tokyoApp').controller('registerCtrl', ["$scope","$http", 
    function($scope, $http) {

        $scope.countries = ["Australia", "Bolivia", "China", "Denemark", "Israel", "Latvia", "Monaco", "August", "Norway", "Panama", "Switzerland", "USA"]
        
        $scope.questions = []

        $http.get('questions.json').then(function(response){
            console.log("trying..")
            $scope.questions = response.data;
        });

        $scope.submitForm = function(isValid) {

            // check to make sure the form is completely valid
            if (isValid) {
              alert('our form is amazing');
            }
          };
    }
]);