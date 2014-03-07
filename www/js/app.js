angular.module('password-scrambler', ['pascalprecht.translate', 'ionic', 'password-scrambler.services', 'password-scrambler.controllers'])
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
            .state('scramble', {
                url: '/scramble',
                templateUrl: 'templates/scramble.html',
                controller: 'ScrambleCtrl'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'templates/about.html'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/scramble');
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
            'en_us': 'en',
            'en_uk': 'en',
            'de_DE': 'de',
            'de_CH': 'de',
            'de_de': 'de',
            'de_ch': 'de'
        });
        $translateProvider.determinePreferredLanguage();
        //$translateProvider.preferredLanguage('en');

    }]);

