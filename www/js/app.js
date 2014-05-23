angular.module('password-scrambler', ['pascalprecht.translate', 'ionic', 'password-scrambler.services', 'password-scrambler.controllers'])
    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            .state('app.generator', {
                url: '/generator',
                views: {
                    'menuContent' :{
                        templateUrl: "templates/generator.html",
                        controller: 'PasswordGeneratorCtrl'

                    }
                }
            })
            .state('app.settings', {
                url: '/settings',
                views: {
                    'menuContent' :{
                        templateUrl: "templates/settings.html",
                        controller: 'SettingsCtrl'

                    }
                }

            })
            .state('app.scramble', {
                url: '/scramble',
                views: {
                    'menuContent' :{
                        templateUrl: "templates/scramble.html",
                        controller: 'ScrambleCtrl'

                    }
                }
            })
            .state('app.about', {
                url: '/about',
                views: {
                    'menuContent' :{
                        templateUrl: "templates/about.html",

                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/scramble');
    })
    .config(['$translateProvider', function ($translateProvider) {
        $translateProvider.useMissingTranslationHandlerLog();
        $translateProvider.useSanitizeValueStrategy(null);
        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/locale-',
            suffix: '.json'
        });
        $translateProvider.registerAvailableLanguageKeys(['en', 'de'], {
            'en_US': 'en',
            'en_UK': 'en',
            'de_DE': 'de',
            'de_CH': 'de'
        });
        $translateProvider.determinePreferredLanguage();
        //$translateProvider.preferredLanguage('en');

    }]);

