angular.module('tokyoApp')
.service('loginService', ['$http', '$location','localStorageModel','poiService', function ($http, $location, localStorageModel, poiService){

    let serverUrl = 'http://localhost:3000/api'
    var self = this
    this.isLoggedInObject = {
        isLoggedin: false,
        firstName: "Guest",
        favePois: {}
    };

    this.checkLogIn = function(){
        const token_key  = "token";
        const name_key = "name";
        
        const token = localStorageModel.getLocalStorage(token_key);
        const user = localStorageModel.getLocalStorage(name_key);
        const faves = localStorageModel.getLocalStorage("faves");

        if(token && user && faves) {
            this.isLoggedInObject.isLoggedin = true;
            this.isLoggedInObject.firstName = user;
            this.isLoggedInObject.favePois = faves;
            $http.defaults.headers.common['authorization'] = "Bearer " + token
            $http.defaults.headers.delete = { "Content-Type": "application/json;charset=utf-8" };
        }
    };
    this.checkLogIn(); //done once when opening website.

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
            firstName: "Guest",
            favePois: {}
        }
        this.isLoggedInObject = obj;

        localStorageModel.removeItem("token")
        localStorageModel.removeItem("name")
        localStorageModel.removeItem("faves")
    }

    this.login = function (user) {
        return $http.post(serverUrl + "/auth/login", user)
            .then(function (response) {
                //First function handles success
                self.token = response.data.token
                self.setToken(self.token)
                localStorageModel.addLocalStorage( "token" , response.data.token);
                localStorageModel.addLocalStorage( "name" , response.data.firstName);
                favePoisTmp = {}
                var faves = poiService.getFavoritePois()
                faves.then(function(result){
                    if(result.status === 200){
                        for (fave of result.data.userFavorites){ //if user logged in, create the faves dictionary
                            favePoisTmp[fave.PID] = fave
                        }
                        poiService.insertFaves(favePoisTmp)
                        let obj = {
                            isLoggedin: true,
                            firstName: self.isLoggedInObject.firstName,
                            favePois: favePoisTmp
                        }
                        self.isLoggedInObject = obj
                    }
                    else{
                        console.log("Couldnt get favorite POIs.")
                    }
                });

                let tmpObj = {
                    firstName: response.data.firstName,
                    isLoggedin: true,
                    favePois: favePoisTmp
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
        return $http.get(serverUrl + "/guests/poi/" + pid )
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
        localStorageModel.addLocalStorage("faves", favePois );
    }

    this.updateDatabaseFaves = function(addedPois, deletedPois){
        for(newFave in addedPois){
            newObj = {"id": newFave} 
            this.addFavePoi(newObj)
        }
        for(deletedFave in deletedPois){
            deletedObj = { "id": deletedFave }
            this.deleteFavePoi( deletedObj)
        }
    }

}])
.service('adminService',['$http','$location', function( $http, $location){

    let serverUrl = 'http://localhost:3000/api'

    this.getAdminData = function(){
        return $http.post(serverUrl + "/auth/protected/admin")
        .then((response) =>{
            return response
        }, (err)=>{
            console.log("Something went wrong :-( ----> adminService " + err)
            return err
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
}]) /*
.service('orderService',['$http', function($http){

    let serverUrl = 'http://localhost:3000/api'

    this.getUserOrder = function(){
        return $http.post(serverUrl + "/auth/protected/poi/userOrder")
        .then(function(response){
            debugger;
            return response;
        }), function(response){
            debugger
            console.log("Something went wrong :-(")
            return response;
        }
    }

}]); */



