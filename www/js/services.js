var DEFAULT_SCRAMBLER_SETUP = {
    'headMasterParts': [
        {'color': "#43cee6", servicePart: {index: 2, type: 'tail'}},
        {'color': "#66cc33", servicePart: {index: 1, type: 'head'}}
    ],
    'tailMasterParts': [
        {'color': "#ef4e3a", servicePart: {index: 3, type: 'tail'}}
    ]
};

var DEFAULT_SERVICES = [
    { name: 'Amazon'},
    { name: 'eBay'},
    { name: 'Google'},
    { name: 'Facebook'},
    { name: 'Flickr'},
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
        function replaceAt(str, index, character) {
            return str.substr(0, index) + character + str.substr(index + character.length);
        }

        return {
            scramble: function (password, service) {
                var scramblerSetup = this.getScramblerSetup();
                if (password && service) {

                    var masterPart, servicePart, replacementChar, scrambledPassword = password;
                    // replace the header parts
                    for (var i = 0; i < scramblerSetup.headMasterParts.length; i++) {
                        masterPart = scramblerSetup.headMasterParts[i];

                        servicePart = masterPart.servicePart;
                        if (servicePart.type == 'head') {
                            replacementChar = service[servicePart.index];
                        } else if (servicePart.type == 'tail') {
                            replacementChar = service[service.length - servicePart.index];
                        }
                        scrambledPassword = replaceAt(scrambledPassword, i, replacementChar);
                    }

                    // replace the tail parts
                    for (var j = 0; j < scramblerSetup.tailMasterParts.length; j++) {
                        masterPart = scramblerSetup.tailMasterParts[j];

                        servicePart = masterPart.servicePart;
                        if (servicePart.type == 'head') {
                            replacementChar = service[servicePart.index];
                        } else if (servicePart.type == 'tail') {
                            replacementChar = service[service.length - servicePart.index];
                        }
                        scrambledPassword = replaceAt(scrambledPassword, scrambledPassword.length - (j + 1), replacementChar);
                    }

                    return scrambledPassword;
                } else {
                    return undefined;
                }
            },

            getScramblerSetup: function () {
                var scramblerSetup = JSON.parse(localStorage.getItem("scramblerSetup"));
                if (!scramblerSetup || !scramblerSetup.headMasterParts) {
                    scramblerSetup = DEFAULT_SCRAMBLER_SETUP;
                }
                console.log(scramblerSetup);
                return scramblerSetup;
            },

            saveScramblerSetup: function (scramblerSetup, callback) {
                if (!scramblerSetup) {
                    scramblerSetup = DEFAULT_SCRAMBLER_SETUP;
                }
                localStorage.setItem("scramblerSetup", JSON.stringify(scramblerSetup));
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
