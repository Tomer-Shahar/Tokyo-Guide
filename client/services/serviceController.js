angular.module('tokyoApp').service('loginService', ['$http', '$httpProvider' ,'$location','localStorageModel', function ($http, $httpProvider, $location, localStorageModel){

    let token = ""
    let serverUrl = 'http://localhost:3000/api'
    var self = this

    self.currUser = {
        firstName: "",
        lastName: ""
    }

    this.setToken = function (t) {
        token = t
        //$http.defaults.headers.common['x-access-token'] = t
        $httpProvider.defaults.common['Authorization'] = token;
        //$httpProvider.defaults.headers.post[ 'x-access-token' ] = token
        console.log("token set")
    }

    this.login = function (user) {
        // register user
        console.log('logging in from service')
        $http.post(serverUrl + "/auth/login", user)
            .then(function (response) {
                //First function handles success
                self.currUser.firstName = user.firstName
                self.currUser.lastName = user.lastName
                self.setToken(response.data.token)
                localStorageModel.addLocalStorage('token', response.data.token)
                $location.path('/home')
            }, function (response) {
                //Second function handles error
                var x = "Something went wrong";
                console.log(response)
         });
    }
}])

.service('registerService',['$http','$location', function( $http, $location){

    let serverUrl = 'http://localhost:3000/api'

    // KEEPS RETURNING UNDEFINED - What to do?
    this.getRegisterParams = function(){
        return $http.get(serverUrl + "/auth/register")
        .then(function(response){
            this.regParams = response.data
        }, function(response){
            console.log("Something went wrong :-(")
        });
    }

    this.reg = function () {
        // register user
        $http.post(serverUrl + "reg/", user)
            .then(function (response) {
                //First function handles success
                self.reg.content = response.data;

            }, function (response) {
                self.reg.content = response.data
                //Second function handles error
                // self.reg.content = "Something went wrong";
            });
    }


}])

.service('adminService',['$http','$location', function( $http, $location){

    let serverUrl = 'http://localhost:3000/api'

    // KEEPS RETURNING UNDEFINED - What to do?
    this.getAdminData = function(){
        return $http.post(serverUrl + "/auth/protected/admin")
        .then((response) =>{
            return response.data
        }, (err)=>{
            console.log("Something went wrong :-( ----> adminService " + err)
        });
    }
}])


