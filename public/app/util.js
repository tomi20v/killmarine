angular.module('Util', [])

    .service('UtilBoot', function($rootScope, Util) {

        var eventUnBinds = {};

        return {
            activeTabMixin: function() {
                return {
                    activeTab: '',
                    isActiveTab: function(id) {
                        return this.activeTab == id;
                    },
                    setActiveTab: function(id) {
                        this.activeTab = id;
                    }
                };
            }
            //bindListeners: function(scope, listeners) {
            //
            //    var id = scope.id;
            //
            //    eventUnBinds[id] = [];
            //
            //    angular.forEach(listeners, function(listener) {
            //        var boundListener = angular.bind(scope, listener[1]),
            //            unBindFn = $rootScope.$on(listener[0], boundListener);
            //        //var boundListener = function(event, eventData) { listener[1](event, eventData); },
            //        //    unBindFn = $rootScope.$on(listener[0], boundListener);
            //        eventUnBinds[id].push(unBindFn);
            //    });
            //
            //    scope.$on('$destroy', function() {
            //        angular.forEach(eventUnBinds[id], function(fn) { fn() });
            //        delete eventUnBinds[id];
            //    });
            //
            //}
        }
    })
    .service('UtilData', function(Util) {

        return {
            copyWhitelistedProps: function (data, whitelist) {
                var cpy;
                if (angular.isArray(whitelist)) {
                    cpy = {};
                    angular.forEach(whitelist, function(key) {
                        var value = data[key];
                        cpy[key] = angular.isObject(value)
                            ? angular.extend({}, data[key])
                            : value;
                    });
                }
                else {
                    cpy = angular.copy(data);
                }
                return cpy;
            },
            buildDataGetterService: function(data) {
                return {
                    data: function(index) {
                        return Util.lookUp(data, index);
                    }
                }
            },
            buildDataTotalAndGame: function(data, whitelist) {
                var cpy = this.copyWhitelistedProps(data, whitelist);
                angular.extend(data, {
                    tops: {
                        game: {
                            top: angular.copy(cpy),
                            sum: angular.copy(cpy)
                        },
                        total: {
                            top: angular.copy(cpy),
                            sum: cpy
                        }
                    },
                    topsAdd: function(index, value) {
                        var newVal = Util.deepAddMin(this, index, value, 0),
                            t;

                        t = Util.deepAddMin(this.tops.game.sum, index, value, newVal);
                        Util.deepAddMin(this.tops.total.sum, index, value, t);

                        t = Util.deepSetMax(this.tops.game.top, index, newVal);
                        Util.deepSetMax(this.tops.total.top, index, t);
                        return newVal;
                    }
                });
                return this;
            },
            buildDataTotal: function(data, whitelist) {
                var cpy = this.copyWhitelistedProps(data, whitelist);
                angular.extend(data, {
                    tops: {
                        game: angular.copy(cpy),
                        total: cpy
                    },
                    topsAdd: function(index, value) {
                        var newVal = Util.deepAdd(this, index, value),
                            t = Util.deepAddMin(this.tops.game, index, value, newVal);
                        Util.deepAddMin(this.tops.total, index, value, t);
                        return newVal;
                    }
                });
                return this;
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

            },
            deepSetMax: function(data, path, value) {
                var current = this.lookUp(data, path),
                    newMax = Math.max(current, value);
                this.deepSet(data, path, newMax);
                return newMax;
            },
            deepAdd: function(data, path, value) {
                var current = this.lookUp(data, path), ret;
                ret = angular.isFunction(current.add)
                    ? current.add(value)
                    : this.deepSet(data, path, current + value);
                return ret;
            },
            deepAddMin: function(data, path, value, min) {
                var current = this.lookUp(data, path), ret;
                if (angular.isFunction(current.add)) {
                    ret = current.add(value);
                }
                else {
                    ret = this.deepSet(
                        data,
                        path,
                        Math.max(min || 0, current + value)
                    );
                }
                return ret;
            }
        }

    })
    .service('UtilConfig', function() {
        return {
            pause: false,
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
