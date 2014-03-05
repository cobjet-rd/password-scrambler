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
    .controller('ScrambleCtrl', function ($scope, $timeout, $window, $ionicModal, ServicesService, ScramblerService, ClipboardService) {
        $scope.services = ServicesService.all();
        $scope.data = {'service': $scope.services[0]};
        $scope.clearTimeout = {};

        $scope.showPassword = function () {
            $ionicModal.fromTemplateUrl('templates/password.html').then(function (modal) {
                modal.scope.scrambledPassword = $scope.data.scrambledPassword;
                modal.scope.close = function () {
                    modal.remove();
                };
                modal.show();
            });
        };

        $scope.openSelectService = function () {
            $ionicModal.fromTemplateUrl('templates/selectService.html', function (modal) {
                $scope.modal = modal;
            }, {
                scope: $scope
            }).then(function (modal) {
                modal.show()
            });
        };

        $scope.selectService = function (service) {
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

        function getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.round(Math.random() * 15)];
            }
            return color;
        }

        function addHeadPart(heads) {
            heads.push({index: heads.length, color: 'white', type: 'head'});
            return heads;
        }

        function addTailPart(tails) {
            tails.reverse();
            tails.push({index: tails.length + 1, color: 'white', type: 'head'});
            tails.reverse();
            return tails;
        }

        $scope.scramblerSetup = ScramblerService.getScramblerSetup();

        $scope.addServiceHead = function () {
            addHeadPart($scope.scramblerSetup.headServiceParts);
        };

        $scope.addServiceTail = function () {
            addTailPart($scope.scramblerSetup.tailServiceParts);
        }

        $scope.addMasterHead = function () {
            addHeadPart($scope.scramblerSetup.headMasterParts);
        };

        $scope.addMasterTail = function () {
            addTailPart($scope.scramblerSetup.tailMasterParts);
        }

        $scope.selectServicePart = function (part) {
            if (part.color == 'white') {
                part.color = getRandomColor();
                $scope.currentServicePart = part;
            } else {
                // find the part in the master parts and deselect that
                $scope.scramblerSetup.headMasterParts.forEach(function (masterPart) {
                    if (masterPart.servicePart && masterPart.servicePart.color == part.color) {
                        masterPart.color = 'white';
                        masterPart.servicePart = undefined;
                    }
                });
                $scope.scramblerSetup.tailMasterParts.forEach(function (masterPart) {
                    if (masterPart.servicePart && masterPart.servicePart.color == part.color) {
                        masterPart.color = 'white';
                        masterPart.servicePart = undefined;
                    }
                });
                part.color = 'white';
                $scope.currentServicePart = undefined;
            }
        };

        $scope.selectMasterPart = function (part) {
            if ($scope.currentServicePart) {
                part.color = $scope.currentServicePart.color;
                part.servicePart = $scope.currentServicePart;
                $scope.currentServicePart = undefined;
            }
        };

        $scope.editScramblerFunction = function () {
            $ionicModal.fromTemplateUrl('templates/editScrambler.html',function (modal) {
                $scope.modal = modal;
            }, {
                scope: $scope
            }).then(function (modal) {
                    modal.show();
            });
        };

        // reset the scrambler function
        $scope.resetScramblerFunction = function () {
            $scope.scramblerSetup = ScramblerService.getDefaultSetup();
        };

        $scope.cancel = function () {
            $scope.scramblerSetup = ScramblerService.getScramblerSetup();
            $scope.modal.remove();
        };

        // save the scrambler setting
        $scope.done = function () {
            ScramblerService.saveScramblerSetup($scope.scramblerSetup, function () {
                $scope.modal.remove();
            });
        };
    })
    .controller('ServiceCtrl', function ($scope, $ionicModal, ServicesService) {
        $scope.services = ServicesService.all();
        $scope.data = {name: ''};

        // opens the add-service modal
        $scope.openAddService = function () {
            $ionicModal.fromTemplateUrl('templates/addService.html',function (modal) {
                $scope.modal = modal;
            }, {
                scope: $scope
            }).then(function (modal) {
                    modal.show();
            });
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
            $scope.modal.remove();
        };

        $scope.done = function (serviceName) {
            if (!serviceName) {
                return;
            }
            $scope.services.push({name: serviceName});
            ServicesService.setServices($scope.services);
            $scope.modal.remove();
        };
    });
