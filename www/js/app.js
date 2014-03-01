angular.module('password-scrambler', ['ionic', 'password-scrambler.services', 'password-scrambler.controllers'])
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('generator', {
                url: '/generator',
                templateUrl: 'templates/generator.html',
                controller: 'PasswordGeneratorCtrl'

            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'templates/settings.html',
                controller: 'SettingsCtrl'

            })
            .state('home', {
                url: '/home',
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/home');
    });

