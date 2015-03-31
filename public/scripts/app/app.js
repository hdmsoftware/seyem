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
        'seyemControllers',
        'ui.bootstrap',
        'ui.router'
    ]);


    seyem.config(['$httpProvider',function ($httpProvider) {
        $httpProvider.interceptors.push('TokenInterceptor');
    }]);



    seyem.config([ '$urlRouterProvider', '$stateProvider', function(  $urlRouterProvider, $stateProvider){
      
     
         // For any unmatched url, redirect to /index
         $urlRouterProvider.otherwise("/");

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
                    templateUrl : "partials/auth/home.html",
                    controller: 'HomeCtrl as home',
                    access: { requiredLogin: false }
                 })
                 .state('dashboard.regimen',{
                    url: "/regimen",
                    templateUrl :"partials/auth/regimen.html",
                    controller : 'RegimenCtrl as regimen'
                 })
               
    }]);

   

    seyem.run(['$rootScope','$location','AuthenticationService',function($rootScope, $location, AuthenticationService) {
        $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {

            if (nextRoute.access===undefined) {
                $location.path("/login");
            }else if (nextRoute.access.requiredLogin && !AuthenticationService.isLogged()) {
                $location.path("/login");
            }else if (AuthenticationService.isLogged() && !nextRoute.access.requiredLogin) {
                $location.path("/home");
            }
        });
    }]);

//    return mainApp;


// });


})();

