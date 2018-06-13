angular.module('tokyoApp').controller('registerCtrl', ["$scope","$http", 'registerService', 'message',
    function (message){
        $scope.message = message;
    },
    function($scope, $http, registerService) {

        let serverUrl = 'http://localhost:3000/api'
        var params;
        $scope.categories = [
            {
                "id": '1',
                "CategoryName": 'a'
            },
            {
                'id': '2',
                'CategoryName': 'b'
            }
        ] 
        console.log("Register parameters:")
        console.log($scope.message)
        /*
        $scope.getParams = function (){
                $http.get(serverUrl + "/auth/register")
            .then(function(response){
                $scope.params = response
                console.log($scope.params)
                return response.data
            }, function(response){
                console.log("Something went wrong :-(")
            });
        } */

       // $scope.countries = $scope.params.data.countries
       // $scope.questions = $scope.params.data.questions
        

        $scope.submitForm = function(isValid) {

            // check to make sure the form is completely valid

            if (!isValid) {
              alert('Some detail is wrong.');
            }
          };
    }
]);