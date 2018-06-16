angular.module('tokyoApp').controller('loginCtrl', ["$scope", "$location", 'loginService','restoreService', function($scope, $location, loginService, restoreService) {

    $scope.loggedIn = $scope.$parent.isLogged
    $scope.forgotPass= false
    $scope.userVerified = false
    $scope.userName = $scope.$parent.userName
    $scope.user = {}
    $scope.user.username = "tomer"
    $scope.user.password = "tomer123"
    
    $scope.verifyUserName = function(){
        //Verify the username with the server..
        $scope.userVerified = !$scope.userVerified
    }

    $scope.login = function () { 
        var userData = loginService.login($scope.user);
        userData.then(function(result){
            $scope.user = result;
            $scope.$parent.userName = $scope.userName;
            $location.path('/home')
        });
    }

    $scope.getQuestions = function(){
        var questions = restoreService.getQuestions($scope.userName)
        questions.then(function(result){
            $scope.questions = result;
            console.log($scope.questions[0].QuestionText)
            console.log($scope.questions[1].QuestionText)
        });
    }

    $scope.flipPassRestore = function(){
        $scope.forgotPass = !$scope.forgotPass
    }
}]);