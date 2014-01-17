angular.module('password-scrambler.services', [])
    .factory('ServicesService', function () {
        var services = [
            { name: 'Google'},
            { name: 'Facebook'},
            { name: 'Twitter'}
        ];

        return {
            all: function () {
                return services;
            }
        };
    });
