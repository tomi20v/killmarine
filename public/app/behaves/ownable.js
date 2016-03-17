angular.module('BehavesOwnable', [])
    .constant('BehavesOwnableProto', {
        owned: {},
        ownedAll: 0,
        firstOwn: {},
        lastOwn: {}
    })
    .service('BehavesOwnableBuilder', [
        'BehavesOwnableProto',
        function(BehavesOwnableProto) {

            return function(obj, def) {

                var oldBuildFn = obj.build;

                return angular.extend(obj, {
                    build: function (data) {

                        data = oldBuildFn(data);

                        angular.merge(data, BehavesOwnableProto);
                        data.firstOwn = {};
                        data.lastOwn = {};

                        angular.forEach(def.defs, function (item, id) {
                            data.owned[id] = 0;
                        });

                        data.saveFields = data.saveFields || [];

                        angular.forEach(Object.keys(BehavesOwnableProto), function (key) {
                            data.saveFields.push(key);
                        });

                        return data;

                    }
                });

            }

        }
    ])
    .service('BehavesOwnableLogic', [
        '$injector',
        'Util',
        'Meta',
        function($injector, Util, Meta) {

            return function(obj, def) {

                var DataService = $injector.get(def.module + 'Data');

                return Util.extendWithWrap(obj, {
                    got: function(id, cnt, successCallback) {

                        this.extendableGot(null, id, cnt);

                        if (successCallback) {
                            successCallback();
                        }

                        obj.refresh();

                    },
                    extendableGot: function(prevGot, id, cnt) {

                        DataService.owned[id]+= cnt;
                        DataService.ownedAll+= cnt;

                        // @todo I'll have to record first/last own in tops too somehow...
                        if (!DataService.firstOwn[id]) {
                            DataService.firstOwn[id] = Meta.data('playTime');
                        }
                        DataService.lastOwn[id] = Meta.data('playTime');

                        if (DataService.defs &&
                            angular.isFunction(DataService.defs[id].success)
                        ) {
                            DataService.defs[id].success($rootScope);
                        }

                    },
                    onGot: function(event, eventData) {
                        console.log('onGot', eventData);
                        this.got(eventData.id, eventData.cnt, eventData.successCallback);
                    },
                    onResetOwned: function(event, eventData) {
                        angular.forEach(DataService.owned, function(cnt, id) {
                            DataService.owned[id] = 0;
                        })
                        DataService.ownedAll = 0;
                    }
                })

            }

        }
    ])
    .service('BehavesOwnableRun', [
        '$injector',
        '$rootScope',
        'Util',
        function($injector, $rootScope, Util) {

            return function(def) {

                var LogicService = $injector.get(def.module + 'Logic');

                $rootScope.$on(def.module + '.got', angular.bind(LogicService, LogicService.onGot));
                $rootScope.$on(def.module + '.resetOwned', angular.bind(LogicService, LogicService.onResetOwned));

            }

        }
    ])
    .service('BehavesOwnableController', [
        '$injector',
        function($injector) {

            return function(obj, def) {

                var Service = $injector.get(def.module);

                return angular.extend(obj, {
                    ownable: {
                        cnt: function(monsterId) {
                            return Service.data(['owned', monsterId]) || 0;
                        },
                        cntDistinct: function() {
                            return Object.keys(Service.data('firstOwn')).length;
                        },
                        cntAll: function() {
                            return Service.data('ownedAll');
                        },
                        ownedIds: function() {
                            return Object.keys(Service.data('firstOwn'));
                        },
                        firstOwn: function(id) {
                            return Service.data(['firstOwn', id]);
                        },
                        lastOwn: function(id) {
                            return Service.data(['lastOwn', id]);
                        }
                    }
                })

            }

        }
    ])
;
