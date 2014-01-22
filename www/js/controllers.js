angular.module('password-scrambler.controllers', [])

    .controller('HeaderCtrl', function ($scope) {
        // toggles the menu
        $scope.toggleMenu = function () {
            $scope.sideMenuController.toggleLeft();
        };
    })
    .controller('MenuCtrl', function ($scope, $rootScope) {
        // close the menu every time the state was changed
        $rootScope.$on('$stateChangeSuccess',
            function () {
                $scope.sideMenuController.close();
            });

    })
    .controller('HomeCtrl', function ($scope, $timeout, $window, ServicesService, ScramblerService, ClipboardService) {
        $scope.services = ServicesService.all();
        $scope.data = {'service': $scope.services[0]};

        // resets all the data
        $scope.reset = function () {
            $scope.data.masterPassword = '';
            $scope.data.scrambledPassword = '';
        };

        // scrambles the password
        $scope.scramblePassword = function () {
            var pass = ScramblerService.scramble($scope.data.masterPassword, $scope.data.service.name);
            $scope.data.scrambledPassword = pass || "Invalid!";
            $timeout(function () {
                document.getElementById('master').blur();
            });

            // reset the passwords in some time
            $timeout($scope.reset, 25000);
        };

        // keyboard event handler that waits for the 'return' key and scrambles the password
        $scope.scrambleOnReturn = function ($event) {
            if ($event.keyCode === 13) {
                $scope.scramblePassword();
            }
        };

        // copies the scrambled password to clipboard using a Cordova clipboard plugin
        $scope.copyToClipboard = function () {
            ClipboardService.copy($scope.data.scrambledPassword).then(function () {
                alert("Copied to clipboard.");
            }, function (reason) {
                alert(reason);
            });
        };

        // now reset
        $scope.reset();
    })
    .controller('SettingsCtrl', function ($scope, $ionicModal, ServicesService, ScramblerService, PasswordService, ClipboardService) {
        // set-up view data
        $scope.settings = {
            services: ServicesService.all(),
            scramblerFunction: ScramblerService.getScramblerFunctionString()
        };

        // prepare the add-service modal view
        $ionicModal.fromTemplateUrl('templates/addService.html', function (modal) {
            $scope.addServiceModal = modal;
        });

        // opens the add-service modal
        $scope.openAddService = function () {
            $scope.addServiceModal.show();
        };

        // reset the list of services
        $scope.resetServices = function () {
            ServicesService.resetServices();
            $scope.settings.services = ServicesService.all();
        };

        // remove the given service
        $scope.removeService = function (service) {
            ServicesService.removeService(service);
            $scope.settings.services = ServicesService.all();
        };

        // reset the scrambler function
        $scope.resetScramblerFunction = function () {
            ScramblerService.setScramblerFunctionString(undefined, function (error) {
                if (error) {
                    alert(error.message);
                }
                $scope.settings.scramblerFunction = ScramblerService.getScramblerFunctionString();
            });
        };

        // save the scrambler function
        $scope.saveScramblerFunction = function (functionString) {
            ScramblerService.setScramblerFunctionString(functionString, function (error) {
                if (error) {
                    alert(error.message);
                }
            });
        };

        $scope.generatePassword = function () {
            $scope.settings.generatedPassword = PasswordService.generatePassword(10, false, '[\\d\\W\\w\\p]');
        };

        // copies the text to the clipboard using Clipboard Service
        $scope.copyToClipboard = function (text) {
            ClipboardService.copy(text).then(function () {
                alert("Copied to clipboard.");
            }, function (reason) {
                alert(reason);
            });
        };
    })
    .controller('ServiceCtrl', function ($scope, ServicesService) {
        $scope.service = {name: ''};

        $scope.cancel = function () {
            $scope.modal.hide();
        };
        $scope.done = function (serviceName) {
            if (!serviceName) {
                return;
            }
            ServicesService.addService(serviceName);
            $scope.modal.hide();
        };
    });
