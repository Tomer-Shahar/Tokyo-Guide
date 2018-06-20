angular.module('tokyoApp').controller('registerCtrl', ["$scope", 'registerService', 'message', '$location',
    function($scope, registerService, message, $location) {

        $scope.params = message;        
        $scope.questions = $scope.params.questions
        $scope.countries = $scope.params.countries
        $scope.user = {}
        $scope.registerSuccess = false
        $scope.showError = false

        //init them all with 0 so they won't be undefined.
        $scope.user.cat1 = 0
        $scope.user.cat2 = 0
        $scope.user.cat3 = 0
        $scope.user.cat4 = 0
        $scope.user.question1 = {}
        $scope.user.question2 = {}
        $scope.user.question1.QuestionID = -1
        $scope.user.question2.QuestionID = -1

        if($scope.$parent.isLoggedInObject.isLogged){
            $scope.registerSuccess = true
            $scope.loggedIn = true
        }


        $scope.submitForm = function() {

            $scope.errorMessage = "";
            $scope.showError = false
            if(!$scope.validateForm()){
                $scope.showError = true
            }
            else{
                let registrationObj = {
                    username: $scope.user.userName,
                    firstName: $scope.user.firstName,
                    lastName: $scope.user.lastName,
                    city: $scope.user.city,
                    country: $scope.user.country,
                    password: $scope.user.password,
                    email: $scope.user.email,
                    questionID1: $scope.user.question1.QuestionID,
                    answer1: $scope.user.answer1,
                    questionID2: $scope.user.question2.QuestionID,
                    answer2: $scope.user.answer2
                }
                $scope.setCategories(registrationObj)
    
                var message = registerService.register(registrationObj)
                message.then(function(result){
                    if(result.status !== 200){
                        if(result.data.message !== undefined){
                            $scope.errorMessage = "• " + result.data.message + "\n"
                            $scope.errorMessage += "• Please correct these errors and submit again ( ͡° ͜ʖ ͡°)"

                        }
                        else{
                            $scope.errorMessage = "• " + result.data + "\n"
                            $scope.errorMessage += "• Please correct these errors and submit again ( ͡° ͜ʖ ͡°)"
                        }
                        $scope.showError = true
                    }
                    else{ //register success!
                        $scope.registerSuccess = true
                        $location.path('/home')
                    }
                });
            }
          };
 
        $scope.validateForm = function(){
            
            let regex = /^[a-zA-Z]+$/;
            if(!regex.test($scope.user.userName)){
                $scope.errorMessage += "• Username may only contain letters." + '\n'
            }
            regex = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
            if( !regex.test($scope.user.password)){
                $scope.errorMessage += "• Password must contain BOTH numbers and letters." + '\n'
            }
            regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(!regex.test($scope.user.email)){
                $scope.errorMessage += "• Invalid email \n"
            }
            if($scope.user.password !== $scope.user.rePassword){
                $scope.errorMessage += "• Repeated password does not match first password. \n";
            }
            if($scope.user.country === undefined){
                $scope.errorMessage += "• Please choose a country. \n"
            }
            sum = $scope.user.cat1 + $scope.user.cat2 + $scope.user.cat3 + $scope.user.cat4
            if(sum==0 || sum===1 || sum==2 || sum==4 || sum==8){
                $scope.errorMessage += "• You must choose at least 2 categories you like. \n"
            }
            if($scope.user.question1.QuestionID === -1 || $scope.user.question2.QuestionID === -1){
                $scope.errorMessage += "• Please choose 2 questions. \n"
            }
            else if($scope.user.question1.QuestionID === $scope.user.question2.QuestionID){
                $scope.errorMessage += "• Please choose 2 different questions. \n"
            }
            if($scope.errorMessage.length > 0){
                $scope.errorMessage += "• Please correct these errors and submit again ( ͡° ͜ʖ ͡°)"
                return false
            }
            else{
                return true
            }
        }

        //Super weird code because of the way the server handles categories.
        //Basically, think of each category like a bit, i.e 1001 means user likes categories "1" and "4"
        $scope.setCategories = function(registrationObj){
            sum = $scope.user.cat1 + $scope.user.cat2 + $scope.user.cat3 + $scope.user.cat4
            switch(sum){
                case 3:
                    registrationObj.category1 = 1
                    registrationObj.category2 = 2
                    break;
                case 5:
                    registrationObj.category1 = 1
                    registrationObj.category2 = 3
                    break;
                case 6:
                    registrationObj.category1 = 2
                    registrationObj.category2 = 3
                    break;
                case 7:
                    registrationObj.category1 = 1
                    registrationObj.category2 = 2
                    registrationObj.category3 = 3
                    break;
                case 9:
                    registrationObj.category1 = 1
                    registrationObj.category2 = 4
                    break;
                case 10:
                    registrationObj.category1 = 2
                    registrationObj.category2 = 4
                    break;
                case 11:
                    registrationObj.category1 = 1
                    registrationObj.category2 = 2
                    registrationObj.category3 = 4
                    break;
                case 12:
                    registrationObj.category1 = 3
                    registrationObj.category2 = 4
                    break;
                case 13:
                    registrationObj.category1 = 1
                    registrationObj.category2 = 3
                    registrationObj.category3 = 4
                    break;
                case 14:
                    registrationObj.category1 = 2
                    registrationObj.category2 = 3
                    registrationObj.category3 = 4
                    break;
                case 15:
                    registrationObj.category1 = 1
                    registrationObj.category2 = 2
                    registrationObj.category3 = 3
                    registrationObj.category4 = 4
                    break;
            }

        }
    }
]);