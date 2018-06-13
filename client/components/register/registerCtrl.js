angular.module('tokyoApp').controller('registerCtrl', ["$scope", 'registerService', 'message',
    function($scope, registerService, message) {

        $scope.params = message;        
        $scope.categories = $scope.params.categories
        $scope.questions = $scope.params.questions
        $scope.countries = $scope.params.countries

        $scope.submitForm = function(isValid) {

            // check to make sure the form is completely valid

            if (!isValid) {
              alert('Some detail is wrong.');
            }
          };
    }
]);