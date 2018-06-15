angular.module('tokyoApp')
.service('loginService', ['$http', /*'$httpProvider', */ '$location','localStorageModel', function ($http, /* $httpProvider, */ $location, localStorageModel){

    let token = ""
    let serverUrl = 'http://localhost:3000/api'
    var self = this
    self.firstName = "Guest"
    self.loggedIn = false

    this.setToken = function (t) {
        token = t
        //$http.defaults.headers.common['x-access-token'] = t
        $http.defaults.headers.common['authorization'] = t
        //$httpProvider.defaults.common['Authorization'] = token;
        //$http.defaults.headers.post[ 'authorization' ] = token
        console.log("token set")
    }

    this.login = function (user) {
        // register user
        return $http.post(serverUrl + "/auth/login", user)
            .then(function (response) {
                //First function handles success
                self.setToken(response.data.token)
                localStorageModel.addLocalStorage('token', response.data.token)
                self.firstName = response.data.firstName
                self.loggedIn = true
                console.log("loginService: The user " + self.firstName + " has logged in." )
                return response.data;

            }, function (response) {
                //Second function handles error
                var x = "Something went wrong";
                console.log(response)
         });
    }
}])
.service('randomPoiService',['$http','$location', function( $http, $location){

    let serverUrl = 'http://localhost:3000/api'

    this.getRandomPoi = function(num){
        return $http.get(serverUrl + "/guests/poiRand/"+num+"/2.5")
        .then((response) =>{
            return response.data
        }, (err)=>{
            console.log("Something went wrong :-( ----> adminService " + err)
        });
    }
}])

.service('registerService',['$http', function( $http){

    let serverUrl = 'http://localhost:3000/api'

    this.getRegisterParams = function(){
        console.log("in the register service")
        return $http.get(serverUrl + "/auth/register")
        .then(function(response){
            return response.data
        }, function(response){
            console.log("Something went wrong :-(")
        });
    }
}])

.service('poiService',['$http','$location', function( $http, $location){

    let serverUrl = 'http://localhost:3000/api'

    this.getRegisterParams = function(){
        return $http.get(serverUrl + "/guests/poi")
        .then(function(response){
            return response.data
        }, function(response){
            console.log("Something went wrong :-(")
        });
    }

    this.getFavoritePois = function(){
        return $http.get(serverUrl + "/guests/poi")
        .then(function(response){
            return response.data
        }, function(response){
            console.log("Something went wrong :-(")
        });
    }

    this.getNewReviews = function(poiID){
        return $http.get(serverUrl + "/guests/review/" + poiID + "/2" )
        .then(function(response){
            console.log("Reviews: " + response.data)
            return response.data
        }, function(response){
            console.log("Something went wrong :-(")
        });
    }

}])

.service('adminService',['$http','$location', function( $http, $location){

    let serverUrl = 'http://localhost:3000/api'

    this.getAdminData = function(){
        return $http.post(serverUrl + "/auth/protected/admin")
        .then((response) =>{ק
            return response.data
        }, (err)=>{
            console.log("Something went wrong :-( ----> adminService " + err)
        });
    }
}])


