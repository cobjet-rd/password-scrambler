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

            $ionicModal.fromTemplateUrl('templates/password.html',function (modal) {
                $scope.modal = modal;
            }, {
                scope: $scope
            }).then(function (modal) {
                    modal.show()
                });
        };

        $scope.openSelectService = function () {
            $ionicModal.fromTemplateUrl('templates/selectService.html',function (modal) {
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

        function createHeadParts(setupHeadParts, length) {
            var headParts = [];
            for (var i = 0; i < setupHeadParts.length; i++) {
                headParts[i] = {index: i + 1, color: setupHeadParts[i].color, type: 'head', servicePart: setupHeadParts[i].servicePart};
            }
            if (length > headParts.length) {
                for (var j = headParts.length - 1; j < length; j++) {
                    headParts[j] = {index: j + 1, color: 'white', type: 'head'};
                }
            }
            return headParts;
        }

        function createTailParts(setupTailParts, length) {
            var tailParts = [];
            for (var i = setupTailParts.length, j = 0; j < setupTailParts.length; j++) {
                tailParts[j] = {index: i--, color: setupTailParts[i].color, type: 'tail', servicePart: setupTailParts[i].servicePart};
            }
            if (length > tailParts.length) {
                for (var i = length, j = 0; j < length; j++) {
                    tailParts[j] = {index: i--, color: 'white', type: 'tail'};
                }
            }
            return tailParts;
        }

        function setupPartsGrid() {
            var setup = ScramblerService.getScramblerSetup();
            var setupHeadServiceParts = [], setupTailServiceParts = [];
            var setupHeadMasterParts = [], setupTailMasterParts = [];

            //create the data for the head service parts
            for (var i = 0; i < setup.headMasterParts.length; i++) {
                var headMasterPart = setup.headMasterParts[i];
                setupHeadMasterParts[headMasterPart.index - 1] = headMasterPart;

                var servicePart = headMasterPart.servicePart;
                servicePart.color = headMasterPart.color;
                if (servicePart.type == 'head') {
                    setupHeadServiceParts[servicePart.index - 1] = servicePart;
                } else {
                    setupTailServiceParts[servicePart.index - 1] = servicePart;
                }
            }


            //create the data for the tails
            for (var i = 0; i < setup.tailMasterParts.length; i++) {
                var tailMasterPart = setup.tailMasterParts[i];
                setupTailMasterParts[tailMasterPart.index - 1] = tailMasterPart;

                var servicePart = tailMasterPart.servicePart;
                servicePart.color = tailMasterPart.color;
                if (servicePart.type == 'head') {
                    setupHeadServiceParts[servicePart.index - 1] = servicePart;
                } else {
                    setupTailServiceParts[servicePart.index - 1] = servicePart;
                }
            }

            // now fill the gaps
            for (var i = 0; i < setupHeadServiceParts.length; i++) {
                if (!setupHeadServiceParts[i]) {
                    setupHeadServiceParts[i] = {index: i + 1, color: 'white', type: 'head'};
                }
            }
            for (var i = 0; i < setupTailServiceParts.length; i++) {
                if (!setupTailServiceParts[i]) {
                    setupTailServiceParts[i] = {index: i + 1, color: 'white', type: 'head'};
                }
            }

            for (var i = 0; i < setupHeadMasterParts.length; i++) {
                if (!setupHeadMasterParts[i]) {
                    setupHeadMasterParts[i] = {index: i + 1, color: 'white', type: 'head'};
                }
            }
            for (var i = 0; i < setupTailMasterParts.length; i++) {
                if (!setupTailMasterParts[i]) {
                    setupTailMasterParts[i] = {index: i + 1, color: 'white', type: 'head'};
                }
            }



            $scope.headServiceNameLength = setupHeadServiceParts.length;
            $scope.tailServiceNameLength = setupTailServiceParts.length;

            $scope.headMasterNameLength = setupHeadMasterParts.length;
            $scope.tailMasterNameLength = setupTailMasterParts.length;


            $scope.headServiceParts = createHeadParts(setupHeadServiceParts, $scope.headServiceNameLength);
            $scope.tailServiceParts = createTailParts(setupTailServiceParts, $scope.tailServiceNameLength);

            $scope.headMasterParts = createHeadParts(setupHeadMasterParts, $scope.headMasterNameLength);
            $scope.tailMasterParts = createTailParts(setupTailMasterParts, $scope.tailMasterNameLength);
        }

        setupPartsGrid();

        $scope.addServiceHead = function () {
            $scope.headServiceNameLength++;
            $scope.headServiceParts = createHeadParts($scope.headServiceParts, $scope.headServiceNameLength);
        };

        $scope.addServiceTail = function () {
            $scope.tailServiceNameLength++;
            $scope.tailServiceParts = createTailParts($scope.tailServiceParts, $scope.tailServiceNameLength);
        }

        $scope.addMasterHead = function () {
            $scope.headMasterNameLength++;
            $scope.headMasterParts = createHeadParts($scope.headMasterParts, $scope.headMasterNameLength);
        };

        $scope.addMasterTail = function () {
            $scope.tailMasterNameLength++;
            $scope.tailMasterParts = createTailParts($scope.tailMasterParts, $scope.tailMasterNameLength);
        }

        $scope.selectServicePart = function (part) {
            if (part.color == 'white') {
                part.color = getRandomColor();
                $scope.currentServicePart = part;
            } else {
                // find the part in the master parts and deselect that
                $scope.headMasterParts.forEach(function (masterPart) {
                    if (masterPart.servicePart && masterPart.servicePart.color == part.color) {
                        masterPart.color = 'white';
                        masterPart.servicePart = undefined;
                    }
                });
                $scope.tailMasterParts.forEach(function (masterPart) {
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
            ScramblerService.saveScramblerSetup(undefined, function (error) {
                if (error) {
                    alert(error.message);
                } else {
                    setupPartsGrid();
                }
            });
        };

        $scope.cancel = function () {
            $scope.modal.hide();
        };

        // save the scrambler setting
        $scope.done = function () {
            var scramblerSetup = {'headMasterParts': [], 'tailMasterParts': []};

            $scope.headMasterParts.forEach(function (masterPart) {
                if (masterPart.servicePart) {
                    scramblerSetup.headMasterParts.push({
                        'color': masterPart.color,
                        'type': masterPart.type,
                        'servicePart': {'index': masterPart.servicePart.index, 'type': masterPart.servicePart.type}
                    });
                }
            });

            $scope.tailMasterParts.forEach(function (masterPart) {
                if (masterPart.servicePart) {
                    scramblerSetup.tailMasterParts.push({
                        'color': masterPart.color,
                        'type': masterPart.type,
                        'servicePart': {'index': masterPart.servicePart.index, 'type': masterPart.servicePart.type}
                    });
                }
            });

            console.log(scramblerSetup);

            ScramblerService.saveScramblerSetup(scramblerSetup, function () {
                $scope.modal.hide();
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
