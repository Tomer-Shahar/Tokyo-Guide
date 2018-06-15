angular.module('tokyoApp').controller('loginCtrl', ["$scope", "$location", 'loginService','restoreService', function($scope, $location, loginService, restoreService) {

    $scope.loggedIn = $scope.$parent.isLogged
    $scope.forgotPass= false
    $scope.userVerified = false
    console.log("Login controller constructed")
    console.log("username of loginCtrl: " + $scope.userName);
    
    $scope.verifyUserName = function(){
        //Verify the username with the server..
        $scope.userVerified = !$scope.userVerified
    }

    $scope.login = function () { 
        console.log("Entered login function of login controller!")
        var userData = loginService.login($scope.user);
        userData.then(function(result){
            $scope.user = result;
            console.log("Name: "+$scope.user.firstName);
            $scope.$parent.userName = $scope.user.firstName;
            console.log("parents username: " + $scope.$parent.userName)
            $location.path('/home')
        });
        console.log("Back at loginCtrl - after the promise")
    }

    $scope.getQuestions = function(){
        var questions = restoreService.getQuestions($scope.user.username)
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