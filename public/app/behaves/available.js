angular.module('BehavesAvailable', [])
    .constant('BehavesAvailableProto', {
        available: {}
    })
    .service('BehavesAvailableBuilder', [
        'BehavesAvailableProto',
        function(BehavesAvailableProto) {

            return function(obj, def) {

                var oldBuildFn = obj.build;

                return angular.extend(obj, {
                    build: function (data) {

                        data = oldBuildFn(data);

                        angular.merge(data, BehavesAvailableProto);

                        data.saveFields = data.saveFields || [];

                        angular.forEach(Object.keys(BehavesAvailableProto), function (key) {
                            data.saveFields.push(key);
                        });

                        return data;

                    }
                });

            }

        }
    ])
    .service('BehavesAvailableLogic', [
        '$injector',
        'Util',
        'UtilRequires',
        function($injector, Util, UtilRequires) {

            return function(obj, def) {

                var DataService = $injector.get(def.module + 'Data'),
                    applyMaxAvailable = function(id, maxAvailable) {

                    if (maxAvailable === null) {

                        delete DataService.available[id];

                    }
                    else {

                        if ((maxAvailable !== 0) &&
                            (maxAvailable <= DataService.owned[id])) {

                            delete DataService.available[id];

                        }
                        else {

                            DataService.available[id] = maxAvailable;

                        }

                    }

                };

                return Util.extendWithWrap(obj, {
                    available: function(id) {
                        return DataService.available.hasOwnProperty(id);
                    },
                    refresh: function() {
                        angular.forEach(def.defs, function(item, id) {
                            var maxAvailable = UtilRequires.maxAvailable(item.requires, item.max);
                            applyMaxAvailable(id, maxAvailable);
                        })
                    },
                    _canBuy: function(prevCanBuy, id, cnt) {

                        if (!prevCanBuy) {
                            return false;
                        }
                        else if (!DataService.available.hasOwnProperty(id)) {
                            return false;
                        }
                        // this is bad since now available knows about ownable. but just by
                        // having this 'canBuy' function, available already knows about buyable too..
                        else if (DataService.owned) {
                            if (DataService.owned.hasOwnProperty[id] &&
                                (DataService.owned[id] + cnt > DataService.available[id])
                            ) {
                                return false;
                            }
                        }
                        else if (DataService.available < cnt) {
                            return false;
                        }
                        return true;
                    }
                })

            }

        }
    ])
    .service('BehavesAvailableController', [
        '$injector',
        function($injector) {

            return function(obj, def) {

                var DataService = $injector.get(def.module + 'Data'),
                    LogicService = $injector.get(def.module + 'Logic');

                return angular.extend(obj, {
                    available: {
                        ids: function() {
                            return Object.keys(DataService.available);
                        },
                        cntAvailable: function(id) {
                            return LogicService.available(id);
                        }
                    }
                })

            }

        }
    ])
;
