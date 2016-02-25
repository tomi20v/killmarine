angular.module('BehavesSpendable', [])
    .service('BehavesSpendableService', [
        'BehavesSpendableHelper',
        'Util',
        function(BehavesSpendableHelper, Util) {

            return function(obj, def) {

                return Util.extendWithWrap(obj, {
                    canSpend: function(id, cnt) {
                        return BehavesSpendableHelper.canSpend(
                            this.data(['owned', id]),
                            id,
                            cnt
                        );
                    }
                })

            }

        }
    ])
    .service('BehavesSpendableLogic', [
        '$injector',
        'Util',
        'BehavesSpendableHelper',
        function($injector, Util, BehavesSpendableHelper) {

            return function(obj, def) {

                var DataService = $injector.get(def.module + 'Data');

                return Util.extendWithWrap(obj, {
                    canSpend: function(id, cnt) {
                        return BehavesSpendableHelper.canSpend(
                            this.data(['owned', id]),
                            id,
                            cnt
                        );
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
    .service('BehavesSpendableHelper', [
        function() {

            return {
                canSpend: function(owned, id, cnt) {
                    return owned && (owned >= cnt);
                }
            }

        }
    ])
;
