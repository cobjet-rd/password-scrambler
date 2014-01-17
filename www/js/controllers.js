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
        $scope.service = $scope.services[0];

        $scope.reset = function() {
            $scope.masterPassword = '';
            $scope.generatedPassword = '';
        }

        $scope.generatePassword = function(service, masterPassword) {
            $scope.generatedPassword = service + masterPassword;
            $timeout($scope.reset, 6000);
        }

        $scope.reset();

    });
