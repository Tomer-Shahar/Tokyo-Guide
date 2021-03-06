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
        const fave_key = "faves"
        const order_key = "order"
        
        const token = localStorageModel.getLocalStorage(token_key);
        const user = localStorageModel.getLocalStorage(name_key);
        const faves = localStorageModel.getLocalStorage(fave_key);
        const order = localStorageModel.getLocalStorage(order_key);

        if(token && user && faves && order) {
            this.isLoggedInObject.isLoggedin = true;
            this.isLoggedInObject.firstName = user;
            this.isLoggedInObject.favePois = faves;
            this.isLoggedInObject.order = order;
            $http.defaults.headers.common['authorization'] = "Bearer " + token
            $http.defaults.headers.delete = { "Content-Type": "application/json;charset=utf-8" };
            let obj = {
                isLoggedin: true,
                firstName: self.isLoggedInObject.firstName,
                favePois: faves,
                order: order
            }

           // orderService.getUserOrder() //We do this right after logging in in case a user starts adding fave POIs before entering the favePoi Page.
            self.isLoggedInObject = obj
            poiService.getFavoritePois();
            
            //If a token is stored ---> Get favorites from server!
            /*favePoisTmp = {} 
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
            }); */

            
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
        localStorageModel.removeItem("order")
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
                        var serverOrder = orderService.getUserOrder() //We do this right after logging in in case a user starts adding fave POIs before entering the favePoi Page.
                        serverOrder.then(function(orderPromise){
                            orderService.updateLocalOrder(orderPromise)
                            orderService.assignOrder();
                            var localOrder = orderService.getLocalOrder()
                            let obj = {
                                isLoggedin: true,
                                firstName: self.isLoggedInObject.firstName,
                                favePois: favePoisTmp,
                                order: localOrder
                            }
                            self.isLoggedInObject = obj
                        })
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
            return response.data.POIs
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
    self.sessionFaves = localStorageModel.getLocalStorage("faves")
    self.allPois = null
    self.serverFaves = {}

    this.getFavoritePois = function(){
        return $http.post(serverUrl + "/auth/protected/poi/userFavorites")
        .then(function(response){
            self.serverFaves = {}
            for(entry in response.data.userFavorites){
                let pid = response.data.userFavorites[entry].PID
                self.serverFaves[pid] = response.data.userFavorites[entry]
            }
            return response
        }, function(response){
            console.log("Something went wrong :-()")
            return response
        });
    }

    this.getRandomPoi = function(num){
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
       localStorageModel.updateLocalStorage("faves", favePois);
       self.sessionFaves = favePois
    }
    
    this.getLocalFaves = function(){
        return localStorageModel.getLocalStorage("faves");
       // return self.sessionFaves
    }

    this.insertFaves = function(favePois){
        localStorageModel.addLocalStorage("faves", favePois );
        self.sessionFaves = favePois

    }

    this.updateDatabaseFaves = function(addedPois, deletedPois){
        let addPoiPromisesArray = []
        var localFaves = self.getLocalFaves();

        for(pid in localFaves){
            if(!(pid in self.serverFaves)){
                newObj = {"id": pid} 
                addPoiPromisesArray.push(self.addFavePoi(newObj))
                console.log("Poi to be added: " + pid)
            }
        }
        for(pid in self.serverFaves){
            if(!(pid in localFaves)){
                deletedObj = { "id": pid }
                addPoiPromisesArray.push(self.deleteFavePoi(deletedObj))
                console.log("Poi to be deleted: " + pid)
            }
        }

        return Promise.all(addPoiPromisesArray) //Magic function: It will only resolve when all the promises inside resolve.    

            /*
            for(newFave in addedPois){
                newObj = {"id": newFave} 
                addPoiPromisesArray.push(self.addFavePoi(newObj))
                console.log("Poi to be added: " + newFave)
            }
            for(deletedFave in deletedPois){
                deletedObj = { "id": deletedFave }
                addPoiPromisesArray.push(self.deleteFavePoi(deletedObj))
                console.log("Poi to be deleted: " + deletedFave)
    
            } */
        
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

.service('orderService',['$http', 'poiService','localStorageModel', function($http, poiService, localStorageModel){

    let serverUrl = 'http://localhost:3000/api';
    var self = this;
    self.sessionOrder  = localStorageModel.getLocalStorage("order");
   /* if(self.sessionOrder === null){
        self.sessionOrder = {} //We don't want to keep it null so that we can 
    } */
    self.addedPois = []; 

    this.getUserOrder = function(){
        /*if(Object.keys(self.sessionOrder).length !== 0){
            return self.sessionOrder
        }*/
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
        localStorageModel.updateLocalStorage("order", poiOrder );
        self.sessionOrder = poiOrder
    }

    this.addLocalOrder = function(poiOrder){
        localStorageModel.addLocalStorage("order", poiOrder );
        self.sessionOrder = poiOrder
    }

    this.getLocalOrder = function(){
        return localStorageModel.getLocalStorage("order")
      // return self.sessionOrder
    }

    this.deleteLocalOrder = function(){
        localStorageModel.removeItem("order")
        self.sessionOrder = null
    }

    // We generally want to use this one since PUT completely overwrites the server.
    this.updateServerOrder = function(){
        let poiOrder = self.sessionOrder
        let orderArray = []
        for(poi in poiOrder){
            orderArray.push({ PID: poi, position: poiOrder[poi] })
            console.log("Poi: " + poi + " order: " + poiOrder[poi])
        }
        let orderObj = { "orders": orderArray}

        return $http.put(serverUrl + "/auth/protected/poi/order", orderObj)
        .then(function(response){
            console.log("Successfully updated server order")
            return response.data
        }, function(response){
            console.log(response)
            return response
        });
    }

    this.insertServerOrder = function(poiOrder){
        let orderArray = []
        for(poi in poiOrder){
            orderArray.push({ PID: poi, position: poiOrder[poi] })
            console.log("Poi: " + poi + "order: " + poiOrder[poi])
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
        let newPosition = Object.keys(self.sessionOrder).length + 1
        self.sessionOrder[poi.PID] = newPosition
        self.updateLocalOrder(self.sessionOrder);
    }

    //This is a bit trickier - if a poi was deleted we must update all the positions.
    this.removeFromOrder = function(poi){

        let deletedPosition = self.sessionOrder[poi.PID]

        for(pid in self.sessionOrder){
            if(self.sessionOrder[pid] > deletedPosition && poi.PID !== pid){
                self.sessionOrder[pid]--; //bump it up if it isnt the deleted Poi and it had a lower position
            }
        }

        delete self.sessionOrder[poi.PID]
        self.updateLocalOrder(self.sessionOrder);
    }

    //basically, we use this function to deal with the problem when the user has for some reason favorite Pois but they don't have a position assignined.
    this.assignOrder = function(){
        self.correctPositions();
        let favePois = poiService.getLocalFaves();
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

        self.updateLocalOrder(self.sessionOrder)
    }
    
    //in case there's a server error and the positions of the POI aren't sequential starting from 1
    this.correctPositions = function(){
        let newPosition = 1;
        let newOrder = {};
        let orderToPoi = {};
        for(pid in self.sessionOrder){ //create a dict mapping positions to PID for easier iteration
            let position = self.sessionOrder[pid];
            orderToPoi[position] = pid;
        }
        let i = 1;
         //basically loop from min position to max position until we found all of the POIs. 
        while( newPosition <=Object.keys(self.sessionOrder).length ){
            if(i in orderToPoi){
                let currPID = orderToPoi[i];
                newOrder[currPID] = newPosition;
                newPosition++
            }
            i++;
        }
        self.sessionOrder = newOrder;
    }

}]);



