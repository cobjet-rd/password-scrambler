angular.module('password-scrambler.controllers', [])

    .controller('HeaderCtrl', function ($scope) {
        $scope.toggleMenu = function () {
            $scope.sideMenuController.toggleLeft();
        };
    })
    .controller('MenuCtrl', function ($scope) {

    })
    .controller('HomeCtrl', function ($scope, $timeout, ServicesService) {
        $scope.services = ServicesService.all();
        $scope.data = {'service': $scope.services[0]};

        $scope.reset = function() {
            $scope.data.masterPassword = '';
            $scope.data.scrambledPassword = '';
        };

        function scrambler(service, masterPassword) {
            if (masterPassword.length < 4 ) {
                return;
            }
            return service[0] + masterPassword.substring(1, 2) + service[2] + masterPassword.substring(3, masterPassword.length - 1) + service[service.length - 1];
        }

        $scope.scramblePassword = function() {
            var pass = "Invalid!";
            if ($scope.data.service && $scope.data.masterPassword) {
                pass = scrambler($scope.data.service.name.toLowerCase(), $scope.data.masterPassword);
            }
            $scope.data.scrambledPassword = pass;
            $timeout($scope.reset, 20000);
        };

        $scope.scrambleOnReturn = function ($event) {
            if ($event.keyCode === 13) {
                $timeout(function() {
                    document.getElementById('master').blur();
                });

                $scope.scramblePassword();
            }
        }

        $scope.reset();
    });
