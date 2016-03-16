angular.module('Behaves', [
    'BehavesAll',
    'BehavesAvailable',
    'BehavesBuyable',
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

            return {
                build: function (def, type, obj) {
                    var builders = BehavesHelper.getBuilders(def.behaves, type);
                    obj = obj || {};
                    angular.forEach(builders, function (eachBuilder) {
                        obj = eachBuilder(obj, def);
                    });
                    return obj;
                }
            }

        }

    ])
;
