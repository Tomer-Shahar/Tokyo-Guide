angular.module('tokyoApp')
.service('loginService', ['$http', /*'$httpProvider', */ '$location','localStorageModel', function ($http, /* $httpProvider, */ $location, localStorageModel){

    let serverUrl = 'http://localhost:3000/api'
    var self = this
    self.firstName = "Guest"
    self.loggedIn = true
    self.isAdmin = false

    this.setToken = function (t) {
        token = t
        //$http.defaults.headers.common['x-access-token'] = t
        $http.defaults.headers.common['authorization'] = "Bearer " + t
        //$httpProvider.defaults.common['Authorization'] = token;
        //$http.defaults.headers.post[ 'authorization' ] = token
        console.log("token set")
    }

    this.logout = function(){
        console.log("Logging out from service..")
        self.token = ""
        $http.defaults.headers.common['authorization'] = ""
        self.loggedIn = false
        self.isAdmin = false
        self.firstName = "Guest"
    }

    this.login = function (user) {
        // register user
        self.logout();
        return $http.post(serverUrl + "/auth/login", user)
            .then(function (response) {
                //First function handles success
                self.token = response.data.token
                self.setToken(self.token)
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

    this.getFavoritePois = function(){
        return $http.post(serverUrl + "/auth/protected/poi/userFavorites")
        .then(function(response){
            console.log("Getting fave POIs")
            return response.data
        }, function(response){
            console.log("Something went wrong :-(")
        });
    }

    this.getNewReviews = function(poiID){
        return $http.get(serverUrl + "/guests/review/" + poiID + "/2" )
        .then(function(response){
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
        .then((response) =>{
            return response.data
        }, (err)=>{
            console.log("Something went wrong :-( ----> adminService " + err)
        });
    }
}])
.service('restoreService',['$http','$location', function( $http, $location){

    let serverUrl = 'http://localhost:3000/api'

    this.getQuestions = function(userName){
        console.log("Saved Token:" + self.token)
        return $http.post(serverUrl + "/auth/protected/question", userName)
        .then(function(response){
            console.log("Getting questions")
            return response.data
        }, function(response){
            console.log("Something went wrong :-(")
            console.log(response.data)
        });
    }
}])


