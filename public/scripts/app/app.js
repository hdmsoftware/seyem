(function(){


// define([
//     'angular',
//     'angularRoute',
//     'angularLocalStorage',
//     'controllers',
//     'services',
//     'angular-ui-router'

// ], function (angular) {
    'use strict';

    var seyem =  angular.module('seyem', [
        'LocalStorageModule',
        'ngRoute',
        'seyemServices',
        'seyemValues',
        'seyemControllers',
        'ui.bootstrap',
        'ui.router'
    ]);


    seyem.config(['$httpProvider',function ($httpProvider) {
        $httpProvider.interceptors.push('TokenInterceptor');
    }]);

    seyem.config([ '$urlRouterProvider', '$stateProvider', function(  $urlRouterProvider, 
        $stateProvider){
      
         // For any unmatched url, redirect to /login
       //  $urlRouterProvider.otherwise("/login");

                $stateProvider
                  .state("index",{
                     url:"/",
                     templateUrl: "partials/login.html",
                     controller : 'LoginCtrl as login'
                 })
                 .state('login',{
                    url: "/login",
                      templateUrl: "partials/login.html",
                      controller : 'LoginCtrl as login'    
                })
                 .state('register',{
                    url:'/register',
                    templateUrl:'partials/register.html',
                    controller: 'RegistrationCtrl as registration'
                 })
                 .state('dashboard',{
                    url: "/dashboard",
                    templateUrl : "partials/auth/home.html"//,
                    ///controller: 'HomeCtrl as home'//,
                    //access: { requiredLogin: false }
                 })
                 .state('dashboard.manage',{
                    url: "/manage",
                    templateUrl :"partials/auth/regimen.html",
                    controller : 'RegimenCtrl as regimen'
                 })
                 .state('dashboard.new',{
                    url: "/new",
                    templateUrl :"partials/regimen/new.html",
                    controller : 'RegimenCtrl as regimen'
                 })
                 .state('dashboard.assign',{
                    url: "/assign",
                    templateUrl :"partials/regimen/assign.html",
                    controller : 'RegimenCtrl as regimen'
                 })
               
    }]);

   

    seyem.run(['$rootScope','$timeout', '$state', 'AuthenticationService',
        function($rootScope, $timeout, $state, AuthenticationService) {
        // $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {

        //     console.log("nextRoute:" + nextRoute);
        //     console.log("currentRoute:" + currentRoute);

        //     if (nextRoute.access===undefined) {
        //         $location.path("/login");
        //     }else if (nextRoute.access.requiredLogin && !AuthenticationService.isLogged()) {
        //         $location.path("/login");
        //     }else if (AuthenticationService.isLogged() && !nextRoute.access.requiredLogin) {
        //         $location.path("/home");
        //     }
        // });

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams,
            fromState, fromParams){
           // console.log("toState:" + toState);
           // console.log("fromState:" + fromState);

            if (!AuthenticationService.isLogged()){
                // console.log("Not logged in...");
                // $timeout(function() {
                //     $state.go('login');
                // });
            }
            else{
                //console.log("Logged in....");
                //$timeout(function() {
                //    $state.go('dashboard');
                //});
            }

        })
    }]);

//    return mainApp;


// });


})();

