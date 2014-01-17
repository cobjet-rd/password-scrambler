angular.module('password-scrambler', ['ionic', 'password-scrambler.services', 'password-scrambler.controllers'])
    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
            .state('settings', {
                url: '/settings',
                views: {
                    '': {
                        templateUrl: 'templates/settings.html'
                    }
                }})
            // the pet tab has its own child nav-view and history
            .state('home', {
                url: '/home',
                views: {
                    '': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/home');
    });

