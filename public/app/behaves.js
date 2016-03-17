angular.module('Behaves', [
    'BehavesAll',
    'BehavesAvailable',
    'BehavesBuyable',
    'BehavesHasTabs',
    'BehavesItem',
    'BehavesOwnable',
    'BehavesPersisted',
    'BehavesSpendable',
    'BehavesTops'
])
    .service('BehavesHelper', [
        '$injector',
        function($injector) {

            return {
                getKey: function (key, type) {
                    return 'Behaves' + key + type;
                },
                has: function (key, type) {
                    return $injector.has(this.getKey(key, type));
                },
                get: function (key, type) {
                    return $injector.get(this.getKey(key, type));
                },
                getBuilders: function (behaves, type) {
                    var builders = [],
                        othis = this;
                    if (this.has('All', type)) {
                        builders.push(this.get('All', type));
                    }
                    angular.forEach(behaves, function (val, key) {
                        if (othis.has(key, type)) {
                            builders.push(othis.get(key, type));
                        }
                    });
                    return builders;
                }
            };

        }
    ])
    .service('Behaves', [
        'BehavesHelper',
        function(BehavesHelper) {

            var eventUnBinds = {};

            return {
                /**
                 * I build a service of type <type>. will apply all Behaves*Type builders
                 */
                build: function(def, type, obj) {
                    var builders = BehavesHelper.getBuilders(def.behaves, type);
                    obj = obj || {};
                    angular.forEach(builders, function (eachBuilder) {
                        obj = eachBuilder(obj, def);
                    });
                    return obj;
                },
                /**
                 * I add one mixin to obj. The mixin to use is Behaves<key><type>
                 */
                mixin:function(def, key, obj) {
                    // this shall fail if  invalid mixin specified
                    var builder = BehavesHelper.get(key, '');
                    obj = obj || {};
                    return builder(obj, def);
                },
                run: function(def) {
                    var runs = BehavesHelper.getBuilders(def.behaves, 'Run');
                    angular.forEach(runs, function(run) {
                        run(def);
                    });
                },
                bindControllerListeners: function(scope, listeners) {

                    // this code is left here so if I'd ever need bindindgs for a controller,
                    // those should be done by this binder
                    // actually this code should be somewhere else?
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
            }

        }

    ])
;
