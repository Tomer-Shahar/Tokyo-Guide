angular.module('tokyoApp')
.service('loginService', ['$http', '$location','localStorageModel', function ($http, $location, localStorageModel){

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
            $http.defaults.headers.common['authorization'] = "Bearer " + token
            $http.defaults.headers.delete = { "Content-Type": "application/json;charset=utf-8" };
        }
    };
    this.checkLogIn();

    this.setToken = function (t) {
        token = t
        $http.defaults.headers.common['authorization'] = "Bearer " + t
        $http.defaults.headers.delete = { "Content-Type": "application/json;charset=utf-8" };
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
                return response;

            }, function (response) {
                //Second function handles error
                console.log(response)
                return response;
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
        return $http.get(serverUrl + "/auth/register")
        .then(function(response){
            return response.data
        }, function(response){
            console.log("Something went wrong :-(")
            return response;
        });
    }

    this.register = function(params){
        return $http.post(serverUrl + "/auth/register", params)
        .then(function(response){
            return response
        }, function(response){
            console.log("Something went wrong :-(")
            return response
        });
    }

}])
.service('poiService',['$http','$location','localStorageModel', function( $http, $location, localStorageModel){

    let serverUrl = 'http://localhost:3000/api'

    this.getFavoritePois = function(){
        return $http.post(serverUrl + "/auth/protected/poi/userFavorites")
        .then(function(response){
            return response
        }, function(response){
            console.log("Something went wrong :-()")
            return response
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

    this.getAllReviews = function(poiID){
        return $http.get(serverUrl + "/guests/review/" + poiID )
        .then(function(response){
            return response
        }, function(response){
            console.log("Something went wrong :-(")
            return response
        });
    }

    //rankObj = { PID, ranking}
    this.postRank = function(rankObj){
        return $http.post(serverUrl + "/auth/protected/poi/ranking", rankObj )
        .then(function(response){
            return response
        }, function(response){
            console.log("Something went wrong :-(")
            return response
        });
    }

        //reviewObj = { PID, review}
        this.postReview = function(reviewObj){
            return $http.post(serverUrl + "/auth/protected/poi/review", reviewObj )
            .then(function(response){
                return response
            }, function(response){
                console.log("Something went wrong :-(")
                return response
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

    this.incrementViews = function(pid){
        return $http.get(serverUrl + "/guests/" + pid )
        .then(function(response){
            return response
        }, function(response){
            console.log("Something went wrong :-(")
            return response
        });
    }

    this.addFavePoi = function(pidObj){
        return $http.post(serverUrl + "/auth/protected/poi/favorite", pidObj)
        .then(function(response){
            return response
        }, function(response){
            console.log("Something went wrong :-(")
            return response
        });
    }

    this.deleteFavePoi = function(pidObj){
        return $http({
            url: serverUrl + "/auth/protected/poi/favorite", 
            method: 'delete', 
            data: pidObj})
        .then(function(response){
            return response
        }, function(response){
            console.log("Something went wrong :-(")
            return response
        });
    }

    this.countFaves = function(pidObj){
        return $http.post(serverUrl + "/auth/protected/poi/countUserFavorites", pidObj )
        .then(function(response){
            return response
        }, function(response){
            console.log("Something went wrong :-(")
            return response
        });
    }

    this.getPopularPoi = function(){
        return $http.post(serverUrl + "/auth/protected/poi/popular")
        .then(function(response){
            return response
        }, function(response){
            console.log("Something went wrong :-(")
            return response
        });
    }

    this.updateLocalFaves = function(favePois){
        localStorageModel.updateLocalStorage("faves", favePois);
    }
    
    this.getLocalFaves = function(){
        return localStorageModel.getLocalStorage("faves");
    }

    this.insertFaves = function(favePois){
        localStorage.addLocalStorage("faves", favePois );
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
        return $http.post(serverUrl + "/auth/question", userName)
        .then(function(response){
            return response
        }, function(response){
            console.log("Something went wrong :-(")
            return response
        });
    }

    this.sendAnswers = function(answerObj){
        return $http.post(serverUrl + "/auth/forgetPassword", answerObj)
        .then(function(response){
            return response
        }, function(response){
            console.log("Something went wrong :-(")
            return response
        });
    }
}])


