var DEFAULT_SCRAMBLER = "function (masterPassword, service) {"
    + "if (masterPassword.length < 4) {"
    + "    return undefined;"
    + "}"
    + "return service[0] + masterPassword.substring(1, 2) + service[2] + masterPassword.substring(3, masterPassword.length - 1) + service[service.length - 1];"
    + "}";

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
    })
    .factory('ScramblerService', function () {
        return {
            scramble: function (password, service) {
                eval('var scrambler = ' + this.getScramblerFunctionString());
                if (password && service) {
                    return scrambler(password, service.toLowerCase());
                } else {
                    return undefined;
                }
            },

            getScramblerFunctionString: function () {
                var scramblerFunction = localStorage.getItem("scramblerFunction");
                if (!scramblerFunction) {
                    scramblerFunction = DEFAULT_SCRAMBLER;
                }
                return scramblerFunction;
            },
            setScramblerFunctionString: function (scramblerFunctionString) {
                localStorage.setItem("scramblerFunction", scramblerFunctionString);
            }
        };
    });
