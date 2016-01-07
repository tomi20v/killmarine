angular.module('Util', [])

    .service('UtilBoot', function($rootScope, Util) {

        var eventUnBinds = {};

        return {
            prepareData: function(data, whitelist) {
                var cpy ;
                if (angular.isArray(whitelist)) {
                    cpy = {};
                    angular.forEach(data, function(value, key) {
                        if (whitelist.indexOf(key) != -1) {
                            cpy[key] = angular.copy(value);
                        }
                    })
                }
                else {
                    cpy = angular.copy(data);
                }
                data._game = angular.copy(cpy);
                data._total = cpy;
                return this;
            },
            buildData: function(data) {
                return angular.extend(data, {
                    inc: function(key, val) {
                        Util.deepSet(data, key, Util.lookUp(data, key) + val);
                    },
                    max: function(key, val) {
                        Util.deepSet(data, key, Math.max(Util.lookUp(data, key), val));
                    }
                })
            },
            buildGetSet: function(data) {
                data.data = function(key, val) {
                    return arguments.length == 1
                        ? Util.lookUp(data, key)
                        : Util.deepSet(data, key, val);
                }
                return data;
            },
            bindListeners: function(scope, listeners) {

                var id = scope.id;

                eventUnBinds[id] = [];

                angular.forEach(listeners, function(listener) {
                    var boundListener = angular.bind(scope, listener[1]),
                        unBindFn = $rootScope.$on(listener[0], boundListener);
                    //var boundListener = function(event, eventData) { listener[1](event, eventData); },
                    //    unBindFn = $rootScope.$on(listener[0], boundListener);
                    eventUnBinds[id].push(unBindFn);
                });

                scope.$on('$destroy', function() {
                    angular.forEach(eventUnBinds[id], function(fn) { fn() });
                    delete eventUnBinds[id];
                });

            }
        }
    })
    .service('UtilMath', function() {

        return {
            randomInt: function(min, max) {

                return Math.floor(min + Math.random() * (max-min));

            },
            sumGeoSeq: function(a1, q, n) {
                return a1 * (Math.pow(q, n) - 1) / (q - 1);
            },
            sumGeoSeqSlice: function(a1, q, n1, n2) {
                return (Math.pow(q, n2) - Math.pow(q, n1-1)) * a1 / (q - 1);
            },
            sumGeoSeqFloor: function(a1, q, n) {
                return Math.floor(this.sumGeoSeq(a1, q, n));
            },
            seqNBySum: function(sum, a1, q) {
                return Math.floor(
                    Math.log(1 - (1 - q) * sum / a1) / Math.log(q)
                );
            }
        }

    })
    .service('Util', function() {

        return {
            lookUp: function(data, path) {
                var slice = data;

                if (angular.isString(path)) {
                    path = path.split('.');
                }

                angular.forEach(path, function(key) {
                    slice = slice[key];
                });
                return slice;
            },
            deepSet: function(data, path, value) {
                var i;

                if (angular.isString(path)) {
                    path = path.split('.');
                }

                for (i=0; i<path.length-1; i++) {
                    data = data[path[i]];
                }

                data[path[i]] = value;

                return value;

            }
        }

    })
    .service('UtilConfig', function() {
        return {
            config: {
                notation: 1
            },
            stepNotation: function() {
                this.config.notation = this.config.notation >= 2
                    ? 0
                    : this.config.notation + 1;
            }
        }
    })
;
