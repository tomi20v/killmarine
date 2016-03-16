angular.module('BehavesItem', [])
    .constant('BehavesItemProto', {
        name: '',
        description: '',
        label: function(nTh) {
            return nTh;
        }
    })
    .service('BehavesItemBuilder', [
        'BehavesItemProto',
        function(BehavesItemProto) {

            return function(obj, def) {

                var oldBuildFn = obj.build;

                return angular.extend(obj, {
                    build: function(data) {

                        data = oldBuildFn(data);

                        angular.extend(data, {
                            defs: {}
                        });
                        angular.forEach(def.defs, function(item, id) {
                            data.defs[id] = angular.merge(
                                {},
                                BehavesItemProto,
                                def.behaves.Item.proto,
                                item
                            );
                        });

                        return data;

                    }
                });

            }

        }
    ])
;
