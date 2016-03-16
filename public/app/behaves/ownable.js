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
;
