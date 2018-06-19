angular.module('tokyoApp').controller('loginCtrl', ["$scope", "$location", 'loginService','restoreService', function($scope, $location, loginService, restoreService) {

    $scope.userName = $scope.$parent.userName
    $scope.user = {}
    $scope.showLogin = true
    $scope.forgotPass= false
    $scope.wrongNameOrPass = false
    $scope.wrongUsername = false
    $scope.showQuestions = false
    $scope.wrongAnswers = false
    $scope.showPassword = false

    $scope.login = function () {
        $scope.wrongNameOrPass = false;
        var userData = loginService.login($scope.user);
        userData.then(function(result){
            if(result.status === 200){
                $scope.user = result.data;
                //$scope.$parent.userName = $scope.userName;
                $location.path('/home')
            }
            else{
                $scope.wrongNameOrPass = true
            }
        });
    }

    $scope.getUserQuestions = function(){
        let userNameObj = { username: $scope.user.username}
        var questions = restoreService.getQuestions(userNameObj)
        questions.then(function(result){
            if(result.status !== 200){
                $scope.wrongUsername = true
            }
            else{
                $scope.questions = result.data;
                $scope.showQuestions = true;
            }
        });
    }

    $scope.answerQuestions = function(){
        let answerObj = {
            username: $scope.user.username,
            questionID1: $scope.questions[0].QuestionID,
            answer1: $scope.answer1,
            questionID2: $scope.questions[1].QuestionID,
            answer2: $scope.answer2
        }
        var details = restoreService.sendAnswers(answerObj)
        details.then(function(result){
            if(result.status !== 200){
                $scope.wrongAnswers = true
            }
            else{ //Success!
                $scope.user = result.data
                $scope.wrongNameOrPass = false
                $scope.wrongUsername = false
                $scope.showQuestions = false
                $scope.wrongAnswers = false
                $scope.forgotPass = false
                $scope.showPassword = true
                $scope.showLogin = false
            }
        });
    }

    $scope.flipPassRestore = function(){
        $scope.forgotPass = !$scope.forgotPass
    }

    $scope.backToLogin = function(){
        $scope.showPassword=false; 
        $scope.showLogin=true
        $scope.answer1 = ""
        $scope.answer2 = ""
        $scope.user.password = ""
    }
}]);