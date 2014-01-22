var DEFAULT_SCRAMBLER = "function (password, service) {\n"
    + "  if (password.length < 4) {\n"
    + "    return undefined;\n"
    + "  }\n"
    + "  return service[0] + password.substring(1, 2) + service[2] + password.substring(3, password.length - 1) + service[service.length - 1];\n"
    + "}";
var DEFAULT_SERVICES = [
    { name: 'Google'},
    { name: 'Facebook'},
    { name: 'Twitter'}
];
angular.module('password-scrambler.services', [])
    .factory('ServicesService', function () {
        var services = localStorage.getItem("services");
        if (!services) {
            localStorage.setItem("services", JSON.stringify(DEFAULT_SERVICES));
        }

        return {
            all: function () {
                return JSON.parse(localStorage.getItem("services"));
            },
            resetServices: function () {
                this.setServices(DEFAULT_SERVICES);
            },
            setServices: function (services) {
                localStorage.setItem("services", JSON.stringify(services));
            },
            removeService: function (service) {
                var services = JSON.parse(localStorage.getItem("services"));
                services.pop(services.indexOf({name: service}));
                localStorage.setItem("services", JSON.stringify(services));
            },
            addService: function (service) {
                var services = JSON.parse(localStorage.getItem("services"));
                services.push({name: service});
                localStorage.setItem("services", JSON.stringify(services));
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
