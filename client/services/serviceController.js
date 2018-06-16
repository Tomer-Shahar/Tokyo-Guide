angular.module('tokyoApp')
.service('loginService', ['$http', /*'$httpProvider', */ '$location','localStorageModel', function ($http, /* $httpProvider, */ $location, localStorageModel){

    let serverUrl = 'http://localhost:3000/api'
    var self = this
    this.isLoggedInObject = {
        isLoggedin: false,
        firstName: "Guest"
    };

    this.checkLogIn = function(){
        const token_key  = "token";
        const name_key = "name";
        
        const token = localStorageModel.getLocalStorage(token_key);
        const user = localStorageModel.getLocalStorage(name_key);

        if(token && user) {
            this.isLoggedInObject.isLoggedin = true;
            this.isLoggedInObject.firstName = user;
        }
    };
    this.checkLogIn();

    this.setToken = function (t) {
        token = t
        $http.defaults.headers.common['authorization'] = "Bearer " + t
    }

    this.logout = function(){
        self.token = ""
        $http.defaults.headers.common['authorization'] = ""
        let obj = {
            isLoggedin : false,
            firstName: "Guest"
        }
        this.isLoggedInObject = obj;

        localStorageModel.removeItem("token")
        localStorageModel.removeItem("name")
    }

    this.login = function (user) {
        // register user
        //this.logout();
        return $http.post(serverUrl + "/auth/login", user)
            .then(function (response) {
                //First function handles success
                self.token = response.data.token
                self.setToken(self.token)
                localStorageModel.addLocalStorage( "token" , response.data.token);
                localStorageModel.addLocalStorage( "name" , response.data.firstName);


                let tmpObj = {
                    firstName: response.data.firstName,
                    isLoggedin: true
                }
                self.isLoggedInObject = tmpObj;
                console.log("loginService: The user " + self.isLoggedInObject.firstName + " has logged in." )
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
        console.log("Entered fave poi service")
        return $http.post(serverUrl + "/auth/protected/poi/userFavorites")
        .then(function(response){
            debugger;
            console.log("Getting fave POIs")
            return response.data
        }, function(response){
            debugger;
            console.log("Something went wrong :-()")
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

    this.getAllPoi = function(){
        return $http.get(serverUrl + "/guests/poi" )
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


