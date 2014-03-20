var DEFAULT_SCRAMBLER_SETUP = {
    'headMasterParts': [
        {'color': "#66cc33", index: 1, servicePart: {index: 1, type: 'head'}},
        {'color': "#43cee6", index: 3, servicePart: {index: 3, type: 'head'}}
    ],
    'tailMasterParts': [
        {'color': "#ef4e3a", index: 1, servicePart: {index: 1, type: 'tail'}}
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
    .factory('ScramblerService', function ($q) {

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
            var tailParts = [], i, j;
            for (i = setupTailParts.length, j = 0; j < setupTailParts.length; j++) {
                tailParts[j] = {index: i--, color: setupTailParts[i].color, type: 'tail', servicePart: setupTailParts[i].servicePart};
            }
            if (length > tailParts.length) {
                for (i = length, j = 0; j < length; j++) {
                    tailParts[j] = {index: i--, color: 'white', type: 'tail'};
                }
            }
            return tailParts;
        }

        function setupPartsGrid(setup) {
            var setupHeadServiceParts = [], setupTailServiceParts = [];
            var setupHeadMasterParts = [], setupTailMasterParts = [];

            var i, servicePart;
            //create the data for the head service parts
            for (i = 0; i < setup.headMasterParts.length; i++) {
                var headMasterPart = setup.headMasterParts[i];
                setupHeadMasterParts[headMasterPart.index - 1] = headMasterPart;

                servicePart = headMasterPart.servicePart;
                servicePart.color = headMasterPart.color;
                if (servicePart.type == 'head') {
                    setupHeadServiceParts[servicePart.index - 1] = servicePart;
                } else {
                    setupTailServiceParts[servicePart.index - 1] = servicePart;
                }
            }


            //create the data for the tails
            for (i = 0; i < setup.tailMasterParts.length; i++) {
                var tailMasterPart = setup.tailMasterParts[i];
                setupTailMasterParts[tailMasterPart.index - 1] = tailMasterPart;

                servicePart = tailMasterPart.servicePart;
                servicePart.color = tailMasterPart.color;
                if (servicePart.type == 'head') {
                    setupHeadServiceParts[servicePart.index - 1] = servicePart;
                } else {
                    setupTailServiceParts[servicePart.index - 1] = servicePart;
                }
            }

            // now fill the gaps
            for (i = 0; i < setupHeadServiceParts.length; i++) {
                if (!setupHeadServiceParts[i]) {
                    setupHeadServiceParts[i] = {index: i + 1, color: 'white', type: 'head'};
                }
            }
            for (i = 0; i < setupTailServiceParts.length; i++) {
                if (!setupTailServiceParts[i]) {
                    setupTailServiceParts[i] = {index: i + 1, color: 'white', type: 'head'};
                }
            }

            for (i = 0; i < setupHeadMasterParts.length; i++) {
                if (!setupHeadMasterParts[i]) {
                    setupHeadMasterParts[i] = {index: i + 1, color: 'white', type: 'head'};
                }
            }
            for (i = 0; i < setupTailMasterParts.length; i++) {
                if (!setupTailMasterParts[i]) {
                    setupTailMasterParts[i] = {index: i + 1, color: 'white', type: 'head'};
                }
            }

            return {
                'headServiceParts': createHeadParts(setupHeadServiceParts, setupHeadServiceParts.length),
                'tailServiceParts': createTailParts(setupTailServiceParts, setupTailServiceParts.length),
                'headMasterParts': createHeadParts(setupHeadMasterParts, setupHeadMasterParts.length),
                'tailMasterParts': createTailParts(setupTailMasterParts, setupTailMasterParts.length)
            };
        }

        function replaceAt(str, index, character) {
            return str.substr(0, index) + character + str.substr(index + character.length);
        }

        return {
            scramble: function (password, service) {
                var deferred = $q.defer();
                var scramblerSetup = this.getScramblerSetup();

                if (!password || !service) {
                    deferred.reject({key: "error_empty_service_password"});
                    return deferred.promise;
                }

                var minPasswordLength = scramblerSetup.headMasterParts.reduce(function (prev, current) {
                    return prev > current.index ? prev : current.index;
                }, 0);
                minPasswordLength += scramblerSetup.tailMasterParts.reduce(function (prev, current) {
                    return prev > current.index ? prev : current.index;
                }, 0);

                if (password.length < minPasswordLength) {
                    deferred.reject({key: "error_password_too_short", value: minPasswordLength});
                    return deferred.promise;
                }

                var masterPart, servicePart, replacementChar, scrambledPassword = password;
                // replace the header parts
                for (var i = 0; i < scramblerSetup.headMasterParts.length; i++) {
                    masterPart = scramblerSetup.headMasterParts[i];

                    servicePart = masterPart.servicePart;
                    if (servicePart) {
                        if (servicePart.type == 'head') {
                            replacementChar = service[servicePart.index - 1];
                        } else if (servicePart.type == 'tail') {
                            replacementChar = service[service.length - servicePart.index];
                        }
                        scrambledPassword = replaceAt(scrambledPassword, masterPart.index - 1, replacementChar);
                    }
                }

                // replace the tail parts
                for (var j = 0; j < scramblerSetup.tailMasterParts.length; j++) {
                    masterPart = scramblerSetup.tailMasterParts[j];

                    servicePart = masterPart.servicePart;
                    if (servicePart) {
                        if (servicePart.type === 'head') {
                            replacementChar = service[servicePart.index - 1];
                        } else if (servicePart.type == 'tail') {
                            replacementChar = service[service.length - servicePart.index];
                        }
                        scrambledPassword = replaceAt(scrambledPassword, scrambledPassword.length - masterPart.index, replacementChar);
                    }
                }
                // something went wrong
                if (!scrambledPassword || scrambledPassword.length === 0) {
                    deferred.reject("error_scrambler_general");
                    return deferred.promise;
                }

                deferred.resolve(scrambledPassword);
                return deferred.promise;
            },

            getScramblerSetup: function () {
                var scramblerSetup = JSON.parse(localStorage.getItem("scramblerSetup"));
                if (!scramblerSetup || !scramblerSetup.headMasterParts) {
                    scramblerSetup = DEFAULT_SCRAMBLER_SETUP;
                }
                console.log(scramblerSetup);
                return setupPartsGrid(scramblerSetup);
            },

            getDefaultSetup: function () {
                return setupPartsGrid(DEFAULT_SCRAMBLER_SETUP);
            },

            saveScramblerSetup: function (scramblerSetup, callback) {
                var newScramblerSetup;
                if (!scramblerSetup) {
                    newScramblerSetup = DEFAULT_SCRAMBLER_SETUP;
                } else {

                    newScramblerSetup = {'headMasterParts': [], 'tailMasterParts': []};

                    scramblerSetup.headMasterParts.forEach(function (masterPart) {
                        if (masterPart.servicePart) {
                            newScramblerSetup.headMasterParts.push({
                                'color': masterPart.color,
                                'index': masterPart.index,
                                'type': masterPart.type,
                                'servicePart': {'index': masterPart.servicePart.index, 'type': masterPart.servicePart.type}
                            });
                        }
                    });

                    scramblerSetup.tailMasterParts.forEach(function (masterPart) {
                        if (masterPart.servicePart) {
                            newScramblerSetup.tailMasterParts.push({
                                'color': masterPart.color,
                                'index': masterPart.index,
                                'type': masterPart.type,
                                'servicePart': {'index': masterPart.servicePart.index, 'type': masterPart.servicePart.type}
                            });
                        }
                    });
                }

                console.log(newScramblerSetup);

                localStorage.setItem("scramblerSetup", JSON.stringify(newScramblerSetup));
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
                if (!length) {
                    length = 10;
                }
                if (!pattern) {
                    pattern = /\w/;
                }
                if (!prefix) {
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
