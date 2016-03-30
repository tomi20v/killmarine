angular.module('BehavesSpendable', [])
    .service('BehavesSpendableService', [
        '$injector',
        'Util',
        function($injector, Util) {

            return function(obj, def) {

                var LogicService = $injector.get(def.module + 'Logic');

                return Util.extendWithWrap(obj, {
                    canSpend: function(id, cnt) {
                        return LogicService.canSpend(id, cnt);
                    }
                })

            }

        }
    ])
    .service('BehavesSpendableLogic', [
        '$injector',
        'Util',
        function($injector, Util) {

            return function(obj, def) {

                var DataService = $injector.get(def.module + 'Data');

                return Util.extendWithWrap(obj, {
                    canSpend: function(id, cnt) {
                        var owned = DataService.owned[id] || 0;
                        return owned && (owned >= cnt);
                    },
                    onSpend: function(event, eventData) {
                        var spend = eventData.spend;
                        if (DataService.owned[spend.id] &&
                            (spend.cnt <= DataService.owned[spend.id])
                        ) {
                            DataService.owned[spend.id] -= spend.cnt;
                            if (eventData.success) {
                                eventData.success();
                            }
                        }
                    }
                });

            }

        }
    ])
    .service('BehavesSpendableRun', [
        '$injector',
        '$rootScope',
        function($injector, $rootScope) {

            return function(def) {

                var LogicService = $injector.get(def.module + 'Logic');

                $rootScope.$on(def.module + '.spend', angular.bind(LogicService, LogicService.onSpend));

            }

        }
    ])
;
