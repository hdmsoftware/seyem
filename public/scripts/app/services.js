(function() {



    // define(['angular','noty'], function (angular,noty) {
    'use strict';

    var seyemServices = angular.module('seyemServices', []);

    seyemServices.service('TokenInterceptor', ['$q', '$location', 'localStorageService',
        function($q, $location, localStorageService) {
            return {
                request: function(config) {
                    config.headers = config.headers || {};

                    if (localStorageService.get("auth_token") !== null)
                        config.headers.Authorization = 'Bearer ' + localStorageService.get("auth_token");

                    return config;
                },

                response: function(response) {
                    return response || $q.when(response);
                },
                responseError: function(response) {

                    console.log(response);

                    if (response.config.url !== "/api/login" && response.status === 401) {
                        localStorageService.clearAll();
                        $location.path("/login");
                        noty({
                            text: "You have to perform signin to earned access to privileged resources!",
                            timeout: 2000,
                            type: 'error'
                        });
                    }

                    return $q.reject(response);

                }
            };
        }
    ]);

    seyemServices.service('cryptoJSService',
        function() {
            return CryptoJS;
        })

    seyemServices.service('AuthenticationService', ['localStorageService', function(localStorageService) {
        return {
            isLogged: function() {
                var authenticated = false;
                if (localStorageService.get("auth_token") !== null)
                    authenticated = true;

                return authenticated;
            },
            getUserName: function() {
                var username = localStorageService.get("user_name");

                if (username != null)
                    return username;

            }
        }
    }])

    seyemServices.service('regimenService', ['$http', function($http) {
        return {
            getRegimens: getRegimens,
            postRegimen: postRegimen
        };

        var urlBase = "/api/regimens'";

        function getRegimens() {
            return $http.get('/api/regimens');
        }

        function postRegimen(data) {
            return $http.post('/api/regimens', data);
        }
    }])

    seyemServices.service('helper', function() {
        return {
            generateUUID : generateUUID,
            getStartDays: getStartDays
        }

        function generateUUID() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        };

        function getStartDays(){
            var startDaysTemp = [];
            for (var i = 1; i < 100; i++) {
                startDaysTemp.push("Day " + i);
            };
            return startDaysTemp;
        }
    })

    

    //     return seyemServices;
    // });


})();