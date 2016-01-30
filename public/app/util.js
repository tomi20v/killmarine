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
                    p0 = Math.floor(sec / 86400) + 'D';
                }

                angular.forEach([3600, 60, 1], p);

                return p0 + parts.join(':');

            },
            playTime: function() {
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
    .run(function($rootScope, UtilTime) {
        $rootScope.$on('Ticker.tick', angular.bind(UtilTime, UtilTime.onTick));
    })
;
