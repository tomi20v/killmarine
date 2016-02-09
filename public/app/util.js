angular.module('Util', [])
    .filter('TimePrint', function(UtilTime) {

        return angular.bind(UtilTime, UtilTime.formatTime);

    })
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
            // this code is left here so if I'd ever need bindindgs for a controller,
            // those should be done by this binder
            //,bindControllerListeners: function(scope, listeners) {
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
            buildDataTopSum: function(data, whitelist) {
                var cpy = this.copyWhitelistedProps(data, whitelist);
                angular.extend(data, {
                    tops: {
                        top: angular.copy(cpy),
                        total: angular.copy(cpy),
                        thisGameSum: angular.copy(cpy),
                        anyGameSum: cpy
                    },
                    topsAdd: function(index, value) {
                        value = value || 0;
                        var newVal = Util.deepAddMin(this, index, value, 0),
                            // max in any game
                            newTop = Util.deepSetMax(this.tops.top, index, newVal),
                            // sum/gained this game
                            newSum = Util.deepAddMin(this.tops.thisGameSum, index, value, newVal),
                            // max gained in any game
                            newAnyGameSum = Util.deepSetMax(this.tops.anyGameSum, index, newSum),
                            // all gained total
                            //newTotalSum = Util.deepAddMin(this.tops.total, index, value, newAnyGameSum);
                            newTotalSum = Util.deepAddMin(this.tops.total, index, value, 0);
                    }
                });
                return this;
            },
            buildDataTop: function(data, whitelist) {
                var cpy = this.copyWhitelistedProps(data, whitelist);
                angular.extend(data, {
                    tops: {
                        top: angular.copy(cpy),
                        total: angular.copy(cpy),
                        thisGameSum: angular.copy(cpy),
                        anyGameSum: cpy
                    },
                    topsAdd: function(index, value) {
                        value = value || 0;
                        var newVal = Util.deepAdd(this, index, value),
                            //t = Util.deepAddMin(this.tops.top, index, value, newVal);
                            t = Util.deepSetMax(this.tops.top, index, newVal);
                        Util.deepAddMin(this.tops.total, index, value, t);
                        //Util.deepSetMax(this.tops.total, index, t);
                        return newVal;
                        //var newVal = Util.deepAdd(this, index, value),
                        //    newTop = Util.deepAddMin(this.tops.top, index, value, newVal),
                        //    newSum =
                        //    ;
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
                if (q == 0) {
                    return 0;
                }
                else if (n == 0) {
                    return 0;
                }
                else if (q == 1) {
                    return a1 * n;
                }
                else {
                    return a1 * (Math.pow(q, n) - 1) / (q - 1);
                }
            },
            sumGeoSeqSlice: function(a1, q, n1, n2) {
                if (!q) {
                    console.log('NOTICE undefined q');
                    return 0;
                }
                return (Math.pow(q, n2) - Math.pow(q, n1-1)) * a1 / (q - 1);
            },
            sumGeoSeqFloor: function(a1, q, n) {
                return Math.floor(this.sumGeoSeq(a1, q, n));
            },
            seqNBySum: function(sum, a1, q) {
                if (q == 0) {
                    return 0;
                }
                return Math.floor(
                    Math.log(1 - (1 - q) * sum / a1) / Math.log(q)
                );
            }
        }

    })
    .service('UtilTime', function() {

        var playTime = 0;

        return {
            formatTime: function(sec) {

                var parts = [], p, p0 = '';

                function p(s) {
                    p = '' + Math.floor(sec / s);
                    if (p.length < 2) {
                        p = '0' + p;
                    }
                    parts.push(p);
                    sec = sec % s;
                }

                if (sec > 86400) {
                    p0 = Math.floor(sec / 86400) + 'd';
                    sec = sec % 86400;
                }

                angular.forEach([3600, 60, 1], p);

                return p0 + parts.join(':');

            },
            playTime: function(){
                return playTime;
            },
            onTick: function(event, tick) {
                playTime = tick.tick.seq;
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
                var current = this.lookUp(data, path) || 0, ret;
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
            },
            idsByTags: function(data, tags) {
                var ids = [];
                angular.forEach(tags, function(tag) {
                    angular.forEach(data, function(item) {
                        if (ids.indexOf(item.id) != -1);
                        else if (item.tags && (item.tags.indexOf(tag) != -1)) {
                            ids.push(item.id);
                        }
                    })
                });
                return ids;
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
    .run(function($rootScope, UtilTime) {
        $rootScope.$on('Ticker.tick', angular.bind(UtilTime, UtilTime.onTick));
    })
;
