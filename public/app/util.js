angular.module('Util', [])
    .filter('TimePrint', [
        'UtilTime',
        function(UtilTime) {

            return angular.bind(UtilTime, UtilTime.formatTime);

        }
    ])
    .service('UtilData', [
        'Util',
        function(Util) {
            // @todo all these shall become obsolete once all modules migrated to behaves
            return {
                buildDataGetterService: function(data) {
                    return {
                        data: function(index) {
                            return Util.lookUp(data, index);
                        }
                    }
                },
                buildDataTopSum: function(data, whitelist) {
                    var cpy = Util.copyProps(data, whitelist);
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
                    return data;
                },
                buildDataTop: function(data, whitelist) {
                    var cpy = Util.copyProps(data, whitelist);
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
                                t = Util.deepSetMax(this.tops.top, index, newVal);
                            Util.deepAddMin(this.tops.total, index, value, t);
                            return newVal;
                        }
                    });
                    return data;
                }
            }
        }
    ])
    .service('UtilMath', [
        function() {

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

        }
    ])
    .service('UtilTime', [
        function() {

            return {
                formatTime: function(sec) {

                    if (!sec) {
                        return '';
                    }

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

                }
            }

        }
    ])
    .service('Util', [
        function() {

            function wrapFn(fn, newFn, obj) {
                return fn ? function() {
                        var ret = fn.apply(obj, arguments);
                        arguments[0] = ret;
                        return newFn.apply(obj, arguments);
                    }
                    : newFn;
            }

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
                copyProps: function (data, whitelist) {
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
                extendWithWrap: function(obj, ext) {

                    angular.forEach(ext, function(val, key) {
                        if (!obj.hasOwnProperty(key)) {
                            obj[key] = angular.copy(val);
                        }
                        else if (angular.isFunction(val)) {
                            obj[key] = wrapFn(obj[key], val, obj);
                        }
                        else {
                            angular.extend(obj[key], val);
                        }
                    });

                    return obj;

                }
            }

        }
    ])
    .service('UtilRequires', [
        '$injector',
        function($injector) {

            function maxByMatch(def, Service) {
                var matches = def.match(/^(.+)\.([0-9]+)?$/),
                    index, cnt, data;
                index = matches[1];
                cnt = matches[2];
                data = Service.data(index);
                return cnt
                    ? (data >= cnt ? 0 : null)
                    : data;
            }
            function maxByService(defs, serviceName) {
                var max = null,
                    Service = $injector.get(serviceName);
                angular.forEach(defs, function(def) {
                    var localMax = maxByMatch(def, Service);
                    max = max === null
                        ? localMax
                        : Math.min(max, localMax);
                });
                return max;
            }
            function maxByCallback(defs, serviceName) {
                console.log('@TODO utilRequire.maxByCallback');
                return null;
            }
            function maxOfTwo(max1, max2) {

                var max;

                if (max1 === null || max2 === null) {
                    max = null;
                }
                else if (max1 === 0 || max2 === 0) {
                    max = max1 + max2;
                }
                else {
                    max = Math.min(max1, max2);
                }

                return max;

            }

            return {
                maxAvailable: function(requires, cap) {
                    var maxAvailable = 0;
                    if (requires) {
                        maxAvailable = 0;
                        angular.forEach(requires, function (defs, serviceName) {
                            var maxByRequire = serviceName == 'callback'
                                ? maxByCallback(defs, serviceName)
                                : maxByService(defs, serviceName);
                            maxAvailable = maxOfTwo(maxAvailable, maxByRequire);
                        });
                    }

                    return maxOfTwo(maxAvailable, cap);

                }
            };

        }
    ])
    .service('UtilConfig', [
        function() {
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
        }
    ])
;
