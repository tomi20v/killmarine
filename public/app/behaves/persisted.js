angular.module('BehavesPersisted', ['Saver'])
    .service('BehavesPersistedBuilder', [
        function() {

            return function(obj, def) {

                var oldBuildFn = obj.build;

                return angular.extend(obj, {
                    build: function(data) {

                        data = oldBuildFn(data);

                        data.saveFields = data.saveFields || [];

                        return data;

                    }
                })

            }

        }
    ])
    .service('xBehavesPersistedData', [
        '$injector',
        'Saver',
        function($injector, Saver) {

            return function(data, def) {

                var saveKey = def.module;

                Saver.register(saveKey, data, data.saveFields);

                angular.merge(data, Saver.load(saveKey));

                return data;

            }

        }
    ])
;
