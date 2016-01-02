angular.module('Util', [])

    .service('UtilBoot', function($rootScope) {

        var eventUnBinds = {};

        return {
            prepareData: function(data) {
                var cpy = angular.copy(data);
                data._game = angular.copy(cpy);
                data._total = cpy;
                return this;
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

            }
        }

    })
;
