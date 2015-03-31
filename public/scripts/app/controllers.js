(function(){



// define(['angular'], function (angular) {
    'use strict';

    var seyemControllers = angular.module('seyemControllers', []);

    seyemControllers.controller('NavCtrl', ['$http', '$state', '$location','localStorageService'
        ,'AuthenticationService',
        function ($http, $state, $location,localStorageService,AuthenticationService) {

            var nav = this;

            nav.isAuthenticated = AuthenticationService.isLogged();

            nav.username = AuthenticationService.getUserName();

            nav.logout = function()
            {

                localStorageService.clearAll();
                $state.go('login');
            }
        }
        ]);

    seyemControllers.controller('LoginCtrl', [ '$http', '$state' ,'$location',"cryptoJSService",'localStorageService',
        function ( $http, $state, $location,CryptoJS,localStorageService) {

            var login =  this;

            login.failed_login = "";

            login.submit = function()
            {
                var salt = login.username;
                var enc_password = CryptoJS.PBKDF2(login.password, salt, { keySize: 256/32 });

                var user = {"username": login.username, "password": enc_password.toString()};

                if(login.username!==undefined || login.password !==undefined){
                    $http({method: 'POST', url: '/api/login', data:user}).
                    success(function(data, status, headers, config) {

                        localStorageService.set("auth_token",data.auth_token);
                        localStorageService.set("user_name",login.username);
                            //$location.path("/dashboard");
                            $state.go('dashboard');

                        }).
                    error(function(data, status, headers, config) {
                        if(status===401){
                            noty({text: 'Wrong username and/or password!',  timeout: 2000, type: 'error'});
                        }else{
                            noty({text: data,  timeout: 2000, type: 'error'});
                        }
                    });
                }else{
                    noty({text: 'Username and password are mandatory!',  timeout: 2000, type: 'error'});
                }

            }

        }
        ]);


seyemControllers.controller('RegistrationCtrl', [ '$state', '$http','cryptoJSService',
    function ( $state, $http, CryptoJS) {

        var registration = this;

        registration.signup = function()
        {
            var salt = registration.username;

            var enc_password = CryptoJS.PBKDF2(registration.password, salt, { keySize: 256/32 });
            var enc_check_password = CryptoJS.PBKDF2(registration.check_password, salt, { keySize: 256/32 });

            var user = {"username": registration.username, "password": enc_password.toString(),
            "check_password" : enc_check_password.toString() };

            if(registration.username!==undefined || registration.password !==undefined || registration.check_password !==undefined){

                if(registration.password !== registration.check_password){
                    noty({text: 'password and check_password must be the same!',  timeout: 2000, type: 'warning'});
                }else{
                    $http({method: 'POST', url: '/api/signup', data:user}).
                    success(function(data, status, headers, config) {
                        noty({text: "Username is registered correctly!",  timeout: 2000, type: 'success'});
                        registration.username = null;
                        registration.password = null;
                        registration.check_password = null;

                        $state.go('dashboard');
                    }).
                    error(function(data, status, headers, config) {
                        noty({text: data.message,  timeout: 2000, type: 'error'});
                    });
                }

            }else{
                noty({text: 'Username and password are mandatory!',  timeout: 2000, type: 'warning'});
            }

        }

    }
    ]);



seyemControllers.controller('HomeCtrl', [ '$http',
    function ($http) {

        var home = this;

        $http({method: 'GET', url: '/api/people'}).
        success(function(data, status, headers, config) {
            home.people = data.people;
        }).
        error(function(data, status, headers, config) {
            if(status!==401){
                noty({text: data,  timeout: 2000, type: 'error'});
            }
        });


        home.updatePerson = function(index,modify)
        {
            var person = home.people[index];

            if(modify){
                home.people[index].modify=true;
            }else{

                $http({method: 'PUT', url: '/api/person/'+person._id,data:{person: person}}).
                success(function(data, status, headers, config) {
                    home.people[index].modify=false;
                }).
                error(function(data, status, headers, config) {
                    if(status!==401){
                        noty({text: data,  timeout: 2000, type: 'error'});
                    }
                });
            }
        }


        home.deletePerson = function(index)
        {

            var person = home.people[index];

            $http({method: 'DELETE', url: '/api/person/'+person._id}).
            success(function(data, status, headers, config) {
                home.people.splice(index, 1);

            }).
            error(function(data, status, headers, config) {
                if(status!==401){
                    noty({text: data,  timeout: 2000, type: 'error'});
                }
            });
        }


    }
    ]);


seyemControllers.controller('PersonCtrl', ['$http',
    function ( $http) {

        var person = this;

        person.person = null;

        person.createPerson = function()
        {
            var person = {person: person.person};

            $http({method: 'POST', url: '/api/person',data:person}).
            success(function(data, status, headers, config) {
                person.person = null;
                noty({text: data.message,  timeout: 2000, type: 'success'});
            }).
            error(function(data, status, headers, config) {
                if(status!==401){
                    noty({text: data,  timeout: 2000, type: 'error'});
                }
            });
        }

    }
    ]);


seyemControllers.controller('RegimenCtrl', [ '$http',
    function ( $http) {

        var regimen =  this;

              // get current regimens
              $http({method: 'GET', url: '/api/regimens'}).
              success(function(data, status, headers, config) {
                $scope.regimens = data.regimens;
            }).
              error(function(data, status, headers, config) {

                if(status!==401){
                    noty({text: data,  timeout: 2000, type: 'error'});
                }
            }); 

              initData();



              regimen.createRegimen = function()
              {
                var regimen = {regimen: regimen.regimendata};

                $http({method: 'POST', url: '/api/regimen',data:regimen}).
                success(function(data, status, headers, config) {
                    regimen.regimendata = null;
                    noty({text: data.message,  timeout: 2000, type: 'success'});
                }).
                error(function(data, status, headers, config) {
                    if(status!==401){
                        noty({text: data,  timeout: 2000, type: 'error'});
                    }
                });
            }

            regimen.resetRegimen = function(){

                regimen.regimendata = null;
                regimen.regimendata = {
                    name: "",
                    medicationlist: []
                };

                regimen.medication = {};   
            }

            regimen.saveTempRegimen = function(){

                var regimen = { regimen: $scope.regimen };
                if ((regimen.regimendata.name !== undefined) && (regimen.regimendata.name !== null)) {
                    regimen.regimendata.active = true;

                    // this is jquery a hack; should use angular directives
                    $('#form-modal-regimen').modal('hide');
                }else{
                    regimen.regimendata.active = false;
                }
            }

            regimen.createRegimen = function(){

               delete regimen.regimendata.active;
               var regimen = {regimen: regimen.regimendata};
             
               $http({method: 'POST', url: '/api/regimen',data:regimen}).
               success(function(data, status, headers, config) {
                regimen.regimendata = null;
                noty({text: data.message,  timeout: 2000, type: 'success'});
            }).
               error(function(data, status, headers, config) {
                if(status!==401){
                    noty({text: data,  timeout: 2000, type: 'error'});
                }
            });
           }

           regimen.saveMedication = function(){

            regimen.regimendata.medicationlist.push({
                "name":      regimen.medication.name,
                "dosage":    regimen.medication.dosage,
                "timesaday": regimen.medication.timesaday,
                "daystart":  regimen.medication.daystart,
                "dayend":    regimen.medication.dayend
            });

                // this is jquery a hack; should use angular directives
                $('#form-modal-content').modal('hide');

                regimen.medication = {};
            }

            $scope.cancelMedication = function(){
                regimen.medication = {};
            }

            $scope.reviewAssignRegimen = function(){
                //var patientRegimen = {patientregimen: regimen.assign}; 
            }

            function initData(){

               // TODO: this function is just for initial mockup
               // everything bellow will be changed accordingly
               

               $(function() {         
                   $('#datepicker').datepicker({
                      autoclose:true,
                  }).on("changeDate", function(e){
                     //console.log(e.date);
                 });

               });

               regimen.today = function() {
                $scope.dt = new Date();
               };
               regimen.today();
            


                /** init form item data */
                regimen.timesadayitems = [
                    '1 time a day',
                    '2 times a day',
                    '3 times a day',
                    '4 times a day',
                    '5 times a day',
                    '6 times a day',
                    '7 times a day',
                    '8 times a day',
                    '9 times a day',
                    '10 times a day'
                    ];

                var startDaysTemp = [];
                for (var i = 1; i < 100; i++) { 
                   startDaysTemp.push("Day " + i);
                };

                regimen.startdays = startDaysTemp;

                regimen.regimendata = {
                    name: "",
                    medicationlist: []
                };

                regimen.medication ={};
        }

    }
]);

//     return seyemControllers;

// });

})();



