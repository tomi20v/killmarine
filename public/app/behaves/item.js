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
    .service('BehavesItemController', [
        '$injector',
        function($injector) {

            return function(obj, def) {

                var Service = $injector.get(def.module),
                    returnCnt = function(cnt) {
                        return cnt;
                    },
                    replaceLabel = function(id, cnt, raw) {
                        var labelFn = Service.data(['defs', id, 'labelFn'])
                            || def.behaves.Item.labelFn
                            || returnCnt;
                        return raw.replace('{{label}}', labelFn(cnt));
                    };

                return angular.extend(obj, {
                    item: {
                        label: function(id, key, cnt) {
                            return replaceLabel(id, cnt, Service.data(['defs', id, key]));
                        },
                        name: function(id) {
                            return Service.data(['defs', id, 'name']);
                        },
                        data: function(id, path) {
                            return Service.data('defs.' + id + '.' + path);
                        }
                    }
                });

            }
        }
    ])
;
