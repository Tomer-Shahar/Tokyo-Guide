angular.module('tokyoApp').controller('registerCtrl', ["$scope","$http", 
    function($scope, $http) {

        $scope.countries = ["Australia", "Bolivia", "China", "Denemark", "Israel", "Latvia", "Monaco", "Norway", "Panama", "Switzerland", "USA"]
        
        $scope.questions = []

        $http.get("questions.json").then(function(response){
            console.log("trying..")
            $scope.questions = response.data;
        });

        $scope.questions.push({
            questionId: 5,
            questionText: "Wubba lubba dub dub"
        });

    }
]);