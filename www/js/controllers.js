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
    .controller('HomeCtrl', function ($scope, $timeout, $window, $ionicModal, ServicesService, ScramblerService, ClipboardService) {
        $scope.services = ServicesService.all();
        $scope.data = {'service': $scope.services[0]};
        $scope.clearTimeout = {};

        $scope.showPassword = function () {
            $timeout.cancel($scope.clearTimeout);

            $ionicModal.fromTemplateUrl('templates/password.html', function (modal) {
                $scope.modal = modal;
            }, {
                scope: $scope
            }).then(function(modal) {modal.show()});
        };

        $scope.openSelectService = function () {
            $ionicModal.fromTemplateUrl('templates/selectService.html', function (modal) {
                $scope.modal = modal;
            }, {
                scope: $scope
            }).then(function(modal) {modal.show()});
        };

        $scope.selectService = function(service) {
            $scope.data.service = service;
            $scope.modal.hide();
        };

        $scope.close = function () {
            $scope.modal.hide();
        };

        // resets all the form data
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
            $scope.clearTimeout = $timeout($scope.reset, 25000);
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
    .controller('SettingsCtrl', function ($scope) {

    })
    .controller('PasswordGeneratorCtrl', function ($scope, PasswordService, ClipboardService) {
        $scope.data = {length: 6, memorable: true};
        $scope.generatePassword = function () {
            $scope.data.generatedPassword = PasswordService.generatePassword($scope.data.length, $scope.data.memorable, '[\\d\\W\\w\\p]');
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
    .controller('ScramblerCtrl', function ($scope, $ionicModal, ScramblerService) {
        // set-up view data
        $scope.data = {
            scramblerFunction: ScramblerService.getScramblerFunctionString()
        };
        $scope.serviceParts = [{value:1, color:"white"},{value:2, color:"white"},{value:3, color:"white"},{value:4, color:"white"}];
        $scope.serviceCol = 100 / $scope.serviceParts.length;
        $scope.masterParts = [{value:1, color:"white"},{value:2, color:"white"},{value:3, color:"white"},{value:4, color:"white"}];

        $scope.masterCol = 100 / $scope.masterParts.length;

        $scope.selectServicePart = function(part) {
            if (part.color == "white") {
                part.color = "red";
                $scope.servicePart = part;
            } else {
                part.color = "white";
                $scope.servicePart = undefined;
            }
        };

        $scope.selectMasterPart = function (part) {
            if ($scope.servicePart) {
                part.color = $scope.servicePart.color;
            }
        };

        // prepare the add-service modal view
        $ionicModal.fromTemplateUrl('templates/editScrambler.html', function (modal) {
            $scope.modal = modal;
        }, {
            scope: $scope
        });

        $scope.editScramblerFunction = function () {
            $scope.modal.show();
        };

        // reset the scrambler function
        $scope.resetScramblerFunction = function () {
            ScramblerService.setScramblerFunctionString(undefined, function (error) {
                if (error) {
                    alert(error.message);
                }
                $scope.data.scramblerFunction = ScramblerService.getScramblerFunctionString();
            });
        };

        $scope.cancel = function () {
            $scope.modal.hide();
        };

        // save the scrambler function
        $scope.done = function (functionString) {
            ScramblerService.setScramblerFunctionString(functionString, function (error) {
                if (error) {
                    alert(error.message);
                } else {
                    $scope.modal.hide();
                    $scope.data.scramblerFunction = ScramblerService.getScramblerFunctionString();
                }
            });
        };
    })
    .controller('ServiceCtrl', function ($scope, $ionicModal, ServicesService) {
        $scope.services = ServicesService.all();
        $scope.data = {name: ''};
        // prepare the add-service modal view
        $ionicModal.fromTemplateUrl('templates/addService.html', function (modal) {
            $scope.modal = modal;
        }, {
            scope: $scope
        });

        // opens the add-service modal
        $scope.openAddService = function () {
            $scope.modal.show();
        };

        // reset the list of services
        $scope.resetServices = function () {
            ServicesService.resetServices();
            $scope.services = ServicesService.all();
        };

        // remove the given service
        $scope.onServiceDelete = function (service) {
            $scope.services.pop($scope.services.indexOf({name: service}));
            ServicesService.setServices($scope.services);
        };

        $scope.cancel = function () {
            $scope.modal.hide();
        };

        $scope.done = function (serviceName) {
            if (!serviceName) {
                return;
            }
            $scope.services.push({name: serviceName});
            ServicesService.setServices($scope.services);
            $scope.modal.hide();
        };
    });
