angular.module('tokyoApp')
.service('loginService', ['$http', '$location','localStorageModel','poiService','orderService', function ($http, $location, localStorageModel, poiService, orderService){

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
       // const faves = localStorageModel.getLocalStorage("faves");

        if(token && user /*&& faves */) {
            this.isLoggedInObject.isLoggedin = true;
            this.isLoggedInObject.firstName = user;
            //this.isLoggedInObject.favePois = faves;
            $http.defaults.headers.common['authorization'] = "Bearer " + token
            $http.defaults.headers.delete = { "Content-Type": "application/json;charset=utf-8" };

            //If a token is stored ---> Get favorites from server!
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

                    orderService.getUserOrder() //We do this right after logging in in case a user starts adding fave POIs before entering the favePoi Page.
                    self.isLoggedInObject = obj
                }
                else{
                    console.log("Couldnt get favorite POIs.")
                }
            });
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
        //localStorageModel.removeItem("faves")
        //localStorageModel.removeItem("order")
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
                        orderService.getUserOrder() //We do this right after logging in in case a user starts adding fave POIs before entering the favePoi Page.
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
.service('randomPoiService',['$http', function( $http){

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
.service('poiService',['$http','localStorageModel', function( $http, localStorageModel){

    var self = this
    let serverUrl = 'http://localhost:3000/api'
    self.sessionFaves = null
    self.allPois = null
    self.serverFaves = {}

    this.getFavoritePois = function(){
        return $http.post(serverUrl + "/auth/protected/poi/userFavorites")
        .then(function(response){
            self.serverFaves = response.data.userFavorites
            return response
        }, function(response){
            console.log("Something went wrong :-()")
            return response
        });
    }

    this.getRandomPoi = function(num){
        debugger
        return $http.get(serverUrl + "/guests/poiRand/"+num+"/2.5")
        .then((response) =>{
            return response.data.POIs
        }, (err)=>{
            console.log("Something went wrong :-( ----> adminService " + err)
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
        })
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
        if(self.allPois !== null){
            return self.allPois
        }
        return $http.get(serverUrl + "/guests/poi" )
        .then(function(response){
            self.allPois = response.data
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
            console.log(response.data.message)
            return response
        });
    }

    this.deleteFavePoi = function(pidObj){
        //We must not try to delete POIs that were deleted in the session only.
        return $http({
            url: serverUrl + "/auth/protected/poi/favorite", 
            method: 'delete', 
            data: pidObj})
        .then(function(response){
            return response
        }, function(response){
            console.log(response.data.message)
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

    this.getUsersLastFaves = function(){
        return $http.post(serverUrl + "/auth/protected/poi/favorites/2")
        .then(function(response){
            return response
        }, function(response){
            console.log("Something went wrong :-(")
            return response
        });
    }

    this.updateLocalFaves = function(favePois){
       // localStorageModel.updateLocalStorage("faves", favePois);
       self.sessionFaves = favePois
    }
    
    this.getLocalFaves = function(){
        //return localStorageModel.getLocalStorage("faves");
        return self.sessionFaves
    }

    this.insertFaves = function(favePois){
        //localStorageModel.addLocalStorage("faves", favePois );
        self.sessionFaves = favePois

    }

    this.updateDatabaseFaves = function(addedPois, deletedPois){
        return new Promise(function(resolve, reject){
            for(newFave in addedPois){
                newObj = {"id": newFave} 
                self.addFavePoi(newObj)
            }
            for(deletedFave in deletedPois){
                deletedObj = { "id": deletedFave }
                self.deleteFavePoi( deletedObj)
            }
            resolve("Done Updating")
        })
    }

}])
.service('adminService',['$http', function( $http){

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
.service('restoreService',['$http', function($http){

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
/*
There is a problem when the user logs in and adds favorite POIs from other pages. They must be concatenated to the existing list of POI positions,
but the positions are only received from server when the user enters the fave page. Therefor we keep a list of POIs that were added before getting the positions
for the first time, and concatenate them when the user does enter the fave page.
*/ 
.service('orderService',['$http', 'poiService', function($http, poiService){

    let serverUrl = 'http://localhost:3000/api';
    var self = this;
    self.sessionOrder = {};
    self.addedPois = []; 

    this.getUserOrder = function(){
        if(Object.keys(self.sessionOrder).length !== 0){
            return self.sessionOrder
        }
        return $http.post(serverUrl + "/auth/protected/poi/userOrder")
        .then(function(response){
            let poiOrder = {};
            for(poi in response.data.userOrder){ //We want to convert the response to a manageable object {3:1, 5:2, 6:3}
                pid = response.data.userOrder[poi].PID;
                position = response.data.userOrder[poi].Position;
                poiOrder[pid] = position;
            }
            self.sessionOrder = poiOrder;
            self.assignOrder();
            self.addedPois = []
            return self.sessionOrder;
        }, function(response){
            console.log("Something went wrong :-(")
            return response
        });
    }

    this.updateLocalOrder = function(poiOrder){
        //localStorageModel.updateLocalStorage("order", poiOrder );
        self.sessionOrder = poiOrder
    }

    this.addLocalOrder = function(poiOrder){
        //localStorageModel.addLocalStorage("order", poiOrder );
        self.sessionOrder = poiOrder
    }

    this.getLocalOrder = function(){
       // return result = localStorageModel.getLocalStorage("order")
       return self.sessionOrder
    }

    this.deleteLocalOrder = function(){
       // localStorageModel.removeItem("order")
       self.sessionOrder = null
    }

    // We generally want to use this one since PUT completely overwrites the server.
    this.updateServerOrder = function(){
        let poiOrder = self.sessionOrder
        let orderArray = []
        for(poi in poiOrder){
            orderArray.push({ PID: poi, position: poiOrder[poi] })
        }
        let orderObj = { "orders": orderArray}

        return $http.put(serverUrl + "/auth/protected/poi/order", orderObj)
        .then(function(response){
            return response.data
        }, function(response){
            console.log("Something went wrong :-(")
            return response
        });
    }

    this.insertServerOrder = function(poiOrder){
        let orderArray = []
        for(poi in poiOrder){
            orderArray.push({ PID: poi, position: poiOrder[poi] })
        }
        let orderObj = { "orders": orderArray}

        return $http.post(serverUrl + "/auth/protected/poi/order", orderObj)
        .then(function(response){
            return response.data
        }, function(response){
            console.log("Something went wrong :-(")
            return response
        });
    }

    //If a poi was added, we just give it a sequential position.
    this.addToOrder = function(poi){
        if(Object.keys(self.sessionOrder).length === 0){ //User hasn't entered favorites yet
            self.addedPois.push(poi.PID);
        }
        else{
            let newPosition = Object.keys(self.sessionOrder).length + 1
            self.sessionOrder[poi.PID] = newPosition
        }
    }

    //This is a bit trickier - if a poi was deleted we must update all the positions.
    this.removeFromOrder = function(poi){
        if(Object.keys(self.sessionOrder).length !== 0){ 
        let deletedPosition = self.sessionOrder[poi.PID]

        for(pid in self.sessionOrder){
            if(self.sessionOrder[pid] > deletedPosition && poi.PID !== pid){
                self.sessionOrder[pid]--; //bump it up if it isnt the deleted Poi and it had a lower position
            }
        }

        delete self.sessionOrder[poi.PID]
        }
        else{ //User hasn't entered favorites yet
            let indexToDelete = self.addedPois.indexOf(poi.PID);
            self.addedPois.splice(indexToDelete,1);
        }
    }

    //basically, we use this function to deal with the problem when the user has for some reason favorite Pois but they don't have a position assignined.
    this.assignOrder = function(){
        let favePois = poiService.getLocalFaves()
        let newPosition = Object.keys(self.sessionOrder).length+1;
        for(pid in favePois){
            if(!(pid in self.sessionOrder)){ //If it isnt in the session order, we got a problem. Concatenate it!
                self.sessionOrder[pid] = newPosition;
                newPosition++;
            }
        }

        for(const pid of self.addedPois){ //iterate over the POIs that were added before sessionOrder was initialized
            if( !(pid in favePois)){
                self.sessionOrder[pid] = newPosition;
                newPosition++;
            }
        }
    }

}]);



