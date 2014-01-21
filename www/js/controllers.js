angular.module('password-scrambler.controllers', [])

    .controller('HeaderCtrl', function ($scope) {
        $scope.toggleMenu = function () {
            $scope.sideMenuController.toggleLeft();
        };
    })
    .controller('MenuCtrl', function ($scope, $rootScope) {
        $scope.open = function (menuItem) {

        };
        $rootScope.$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams) {
                $scope.sideMenuController.close();

            });

    })
    .controller('HomeCtrl', function ($scope, $timeout, $window, ServicesService, ScramblerService) {
        $scope.services = ServicesService.all();
        $scope.data = {'service': $scope.services[0]};

        $scope.reset = function () {
            $scope.data.masterPassword = '';
            $scope.data.scrambledPassword = '';
        };

        $scope.scramblePassword = function () {
            var pass = ScramblerService.scramble($scope.data.masterPassword, $scope.data.service.name);
            $scope.data.scrambledPassword = pass || "Invalid!";
            $timeout(function () {
                document.getElementById('master').blur();
            });
             $timeout($scope.reset, 25000);
        };

        $scope.scrambleOnReturn = function ($event) {
            if ($event.keyCode === 13) {
                $scope.scramblePassword();
            }
        };

        $scope.copyToClipboard = function () {
            window.cordova.plugins.clipboard.copy($scope.data.scrambledPassword, function () {
                alert("Copied to clipboard.");
            }, function () {
                alert("Could not copy to clipboard.");
            });

        };
        $scope.reset();
    })
    .controller('SettingsCtrl', function ($scope, ServicesService, ScramblerService){
        $scope.services = ServicesService.all();
        $scope.scramblerFunction = ScramblerService.getScramblerFunctionString();
    });
