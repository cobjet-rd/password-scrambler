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
    .factory('ClipboardService', function ($window, $q) {
        return {
            copy: function (text) {
                var deferred = $q.defer();
                if (!$window.cordova) {
                    deferred.reject('Cordova not available.');
                } else {
                    window.cordova.plugins.clipboard.copy(text, function () {
                        deferred.resolve();
                    }, function () {
                        deferred.reject("Could not copy to clipboard.");
                    });
                }
                return deferred.promise;
            }
        };
    })
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
    })
    .factory('PasswordService', function () {
        var consonant, letter, vowel;
        letter = /[a-zA-Z]$/;
        vowel = /[aeiouAEIOU]$/;
        consonant = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]$/;

        return {
            generatePassword: function (length, memorable, pattern, prefix) {
                var char, n;
                if (length == null) {
                    length = 10;
                }
                if (memorable == null) {
                    memorable = true;
                }
                if (pattern == null) {
                    pattern = /\w/;
                }
                if (prefix == null) {
                    prefix = '';
                }
                if (prefix.length >= length) {
                    return prefix;
                }
                if (memorable) {
                    if (prefix.match(consonant)) {
                        pattern = vowel;
                    } else {
                        pattern = consonant;
                    }
                }
                n = (Math.floor(Math.random() * 100) % 94) + 33;
                char = String.fromCharCode(n);
                if (memorable) {
                    char = char.toLowerCase();
                }
                if (!char.match(pattern)) {
                    return this.generatePassword(length, memorable, pattern, prefix);
                }
                return this.generatePassword(length, memorable, pattern, "" + prefix + char);
            }
        };
    });
