(function() {



    // define(['angular'], function (angular) {
    'use strict';

    var seyemControllers = angular.module('seyemControllers', []);

    seyemControllers.controller('NavCtrl', ['$http', '$state', '$location', 'localStorageService', 'AuthenticationService',
        function($http, $state, $location, localStorageService, AuthenticationService) {

            var nav = this;

            nav.isAuthenticated = AuthenticationService.isLogged();

            nav.username = AuthenticationService.getUserName();

            nav.logout = function() {

                localStorageService.clearAll();
                $state.go('login');
            }
        }
    ]);

    seyemControllers.controller('LoginCtrl', ['$http', '$state', '$location', "cryptoJSService", 'localStorageService',
        function($http, $state, $location, CryptoJS, localStorageService) {

            var login = this;

            login.failed_login = "";

            login.submit = function() {
                var salt = login.username;
                var enc_password = CryptoJS.PBKDF2(login.password, salt, {
                    keySize: 256 / 32
                });

                var user = {
                    "username": login.username,
                    "password": enc_password.toString()
                };

                if (login.username !== undefined || login.password !== undefined) {
                    $http({
                        method: 'POST',
                        url: '/api/login',
                        data: user
                    }).
                    success(function(data, status, headers, config) {

                        localStorageService.set("auth_token", data.auth_token);
                        localStorageService.set("user_name", login.username);
                        //$location.path("/dashboard");
                        $state.go('dashboard');

                    }).
                    error(function(data, status, headers, config) {
                        if (status === 401) {
                            noty({
                                text: 'Wrong username and/or password!',
                                timeout: 2000,
                                type: 'error'
                            });
                        } else {
                            noty({
                                text: data,
                                timeout: 2000,
                                type: 'error'
                            });
                        }
                    });
                } else {
                    noty({
                        text: 'Username and password are mandatory!',
                        timeout: 2000,
                        type: 'error'
                    });
                }

            }

        }
    ]);


    seyemControllers.controller('RegistrationCtrl', ['$state', '$http', 'cryptoJSService',
        function($state, $http, CryptoJS) {

            var registration = this;

            registration.signup = function() {
                var salt = registration.username;

                var enc_password = CryptoJS.PBKDF2(registration.password, salt, {
                    keySize: 256 / 32
                });
                var enc_check_password = CryptoJS.PBKDF2(registration.check_password, salt, {
                    keySize: 256 / 32
                });

                var user = {
                    "username": registration.username,
                    "password": enc_password.toString(),
                    "check_password": enc_check_password.toString()
                };

                if (registration.username !== undefined || registration.password !== undefined || registration.check_password !== undefined) {

                    if (registration.password !== registration.check_password) {
                        noty({
                            text: 'password and check_password must be the same!',
                            timeout: 2000,
                            type: 'warning'
                        });
                    } else {
                        $http({
                            method: 'POST',
                            url: '/api/signup',
                            data: user
                        }).
                        success(function(data, status, headers, config) {
                            noty({
                                text: "Username is registered correctly!",
                                timeout: 2000,
                                type: 'success'
                            });
                            registration.username = null;
                            registration.password = null;
                            registration.check_password = null;

                            $state.go('dashboard');
                        }).
                        error(function(data, status, headers, config) {
                            noty({
                                text: data.message,
                                timeout: 2000,
                                type: 'error'
                            });
                        });
                    }

                } else {
                    noty({
                        text: 'Username and password are mandatory!',
                        timeout: 2000,
                        type: 'warning'
                    });
                }

            }

        }
    ]);



    seyemControllers.controller('HomeCtrl', ['$http',
        function($http) {

            var home = this;

            $http({
                method: 'GET',
                url: '/api/people'
            }).
            success(function(data, status, headers, config) {
                home.people = data.people;
            }).
            error(function(data, status, headers, config) {
                if (status !== 401) {
                    noty({
                        text: data,
                        timeout: 2000,
                        type: 'error'
                    });
                }
            });


            home.updatePerson = function(index, modify) {
                var person = home.people[index];

                if (modify) {
                    home.people[index].modify = true;
                } else {

                    $http({
                        method: 'PUT',
                        url: '/api/person/' + person._id,
                        data: {
                            person: person
                        }
                    }).
                    success(function(data, status, headers, config) {
                        home.people[index].modify = false;
                    }).
                    error(function(data, status, headers, config) {
                        if (status !== 401) {
                            noty({
                                text: data,
                                timeout: 2000,
                                type: 'error'
                            });
                        }
                    });
                }
            }


            home.deletePerson = function(index) {

                var person = home.people[index];

                $http({
                    method: 'DELETE',
                    url: '/api/person/' + person._id
                }).
                success(function(data, status, headers, config) {
                    home.people.splice(index, 1);

                }).
                error(function(data, status, headers, config) {
                    if (status !== 401) {
                        noty({
                            text: data,
                            timeout: 2000,
                            type: 'error'
                        });
                    }
                });
            }


        }
    ]);


    seyemControllers.controller('PersonCtrl', ['$http',
        function($http) {

            var person = this;

            person.person = null;

            person.createPerson = function() {
                var person = {
                    person: person.person
                };

                $http({
                    method: 'POST',
                    url: '/api/person',
                    data: person
                }).
                success(function(data, status, headers, config) {
                    person.person = null;
                    noty({
                        text: data.message,
                        timeout: 2000,
                        type: 'success'
                    });
                }).
                error(function(data, status, headers, config) {
                    if (status !== 401) {
                        noty({
                            text: data,
                            timeout: 2000,
                            type: 'error'
                        });
                    }
                });
            }

        }
    ]);



    seyemControllers.controller('RegimenCtrl', ['$http', 'regimenService', 'helper', 'timesaday',
        function($http, regimenService, helper, timesaday) {

            var regimen = this;

            regimen.regimendata = {
                name: null,
                medicationlist: []
            };

            regimen.editMedication = {};
            regimen.editMedicationIndex = null;

            regimen.setAdd = function(show) {
                regimen.showAdd = show;
                if (show) {
                    initData();
                }
            };

            regimen.setEdit = function(index) {
                regimen.editMedication = 
                   angular.copy(regimen.regimendata.medicationlist[index]);
                regimen.editMedicationIndex = index;
               
            };

            regimen.cancelEdit = function() {
                regimen.editMedication = {};
                regimen.editMedicationIndex = null;
            };

            regimen.saveEdit = function(medication) {
                regimen.regimendata.medicationlist[regimen.editMedicationIndex] =
                    angular.copy(regimen.editMedication);
                regimen.editMedication = {};
                regimen.editMedicationIndex = null;
              
            }

            regimen.saveMedication = function() {

                regimen.regimendata.medicationlist.push({
                    "name": regimen.medication.name,
                    "dosage": regimen.medication.dosage,
                    "timesaday": regimen.medication.timesaday,
                    "daystart": regimen.medication.daystart,
                    "dayend": regimen.medication.dayend
                });

                regimen.medication = {};

                initData();
            }

            regimen.resetRegimen = function() {

                regimen.regimendata = {
                    name: null,
                    medicationlist: []
                };

                regimen.medication = {};
            }

            regimenService.getRegimens()
                .success(function(data) {
                    regimen.regimens = data.regimens;
                })
                .error(function() {

                    noty({
                        text: "Cannot get regimens",
                        timeout: 2000,
                        type: 'error'
                    });

                });


            regimen.createRegimen = function() {

                var new_regimen = {
                    regimen: regimen.regimendata
                };

                regimenService.postRegimen(new_regimen)
                    .success(function(data) {
                        regimen.regimendata = null;
                        noty({
                            text: data.message,
                            timeout: 2000,
                            type: 'success'
                        });
                    })
                    .error(function() {

                        noty({
                            text: "Cannot post regimen",
                            timeout: 2000,
                            type: 'error'
                        });

                    });
            }


            function initData() {

                // TODO: this function is just for initial mockup
                // everything bellow will be changed accordingly
                regimen.medication = {};

                $(function() {
                    $('#datepicker').datepicker({
                        autoclose: true,
                    }).on("changeDate", function(e) {

                    });

                });

                regimen.today = function() {
                    regimen.dt = new Date();
                };

                regimen.today();
                regimen.medication.timesadayitems = timesaday;
                regimen.medication.startdays = helper.getStartDays();

            }

        }
    ]);

    //     return seyemControllers;

    // });

})();