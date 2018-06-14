angular.module('tokyoApp').controller('poisCtrl', ["$scope",'poiService'/*,'allPois'*/, function($scope, poiService/*, allPois*/) {
    
    console.log("entered pois controller");
    $scope.pois = [
        {
            "name": "Akiba",
            "category": "electronics",
            "views": "30",
            "rating": "4.5",
            "id": "1",
            "isFave": "true"
        },
        {
            "name": "Bahd",
            "category": "electronicsdsadd",
            "views": "320",
            "rating": "2",
            "id": "2",
            "isFave": "false"
        },
        {
            "name": "gasddw",
            "category": "shrines",
            "views": "90",
            "rating": "4",
            "id": "3",
            "isFave": "false"
        },
        {
            "name": "zenzen",
            "category": "goop",
            "views": "800",
            "rating": "4.8",
            "id": "4",
            "isFave": "true"
        }
    ]
 
    $scope.name = "tom"
    $scope.loggedIn = true 
    $scope.isFave = true
    
 }]);