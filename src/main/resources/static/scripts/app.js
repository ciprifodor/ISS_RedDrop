(function(){
    'use strict'
    var app = angular.module('RedDrop', ['ngRoute', 'ngAnimate', 'ngCookies', 'ngAria', 'ngMaterial', 'ngMessages'])

    app.value('apiIP',  'http://127.0.0.1:8080');

    app.config(function ($routeProvider) {
        $routeProvider
            .when("/landing", {
                templateUrl: "views/LandingPage.html",
                controller: 'LandingController',
                controllerAs: 'ctrl'
            })
            .when("/donator/login", {
                templateUrl: "views/DonatorLoginPage.html",
                controller: 'DonatorLoginController',
                controllerAs: 'ctrl'
            })
            .when("/donator/register", {
                templateUrl: "views/DonatorRegisterPage.html",
                controller: 'DonatorRegisterController',
                controllerAs: 'ctrl'
            })
            .when("/donator/main", {
                templateUrl: "views/DonatorMainPage.html",
                controller: 'DonatorMainController',
                controllerAs: 'ctrl'
            })
            .when("/medic/login", {
                templateUrl: "views/MedicLoginPage.html",
                controller: 'MedicLoginController',
                controllerAs: 'ctrl'
            })
            .when("/user/:userToken", {
                templateUrl: "views/FriendsPage.html",
                controller: 'FriendsController',
                controllerAs: 'ctrl'
            })
            .otherwise({ redirectTo: "/landing" });
    });
})();