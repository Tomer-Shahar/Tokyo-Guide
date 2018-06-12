angular.module('tokyoApp').service('setHeadersToken',[ '$http','$location','localStorageModel', function ($http, $location, localStorageModel){

    let token = ""
    let serverUrl = 'http://localhost:3000/api'
    var self = this

    self.currUser = {
        firstName: "",
        lastName: ""
    }

    this.setToken = function (t) {
        token = t
        $http.defaults.headers.common['x-access-token'] = t
        // $httpProvider.defaults.headers.post[ 'x-access-token' ] = token
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
                localStorageModel.addLocalStorage('token', response)
                $location.path('/home')
            }, function (response) {
                //Second function handles error
                var x = "Something went wrong";
                console.log(response)
            });
    }

    self.reg = function () {
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

    self.addTokenToLocalStorage = function () {
        localStorageModel.addLocalStorage('token', self.login.content)
    }
}])


