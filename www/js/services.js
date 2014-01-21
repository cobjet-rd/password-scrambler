var DEFAULT_SCRAMBLER = "function (password, service) {\n"
    + "  if (password.length < 4) {\n"
    + "    return undefined;\n"
    + "  }\n"
    + "  return service[0] + password.substring(1, 2) + service[2] + password.substring(3, password.length - 1) + service[service.length - 1];\n"
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

            setScramblerFunctionString: function (scramblerFunctionString, callback) {
                if (!scramblerFunctionString) {
                    scramblerFunctionString = DEFAULT_SCRAMBLER;
                }
                try {
                    eval('var scrambler = ' + scramblerFunctionString);
                } catch (error) {
                    callback(error);
                }
                localStorage.setItem("scramblerFunction", scramblerFunctionString);
                callback();
            }
        };
    });
