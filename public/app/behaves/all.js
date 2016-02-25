angular.module('BehavesAll', ['Util'])
    .service('BehavesAllService', [
        '$injector',
        'Util',
        function($injector, Util) {

            return function(obj, def) {

                var dataObj = $injector.get(def.module + 'Data');

                return Util.extendWithWrap(obj, {
                    data: function(path) {

                        return Util.lookUp(dataObj, path);

                    }
                });

            }

        }
    ])
    .service('BehavesAllBuilder', [
        'Util',
        function(Util) {

            return function(obj, def) {

                return Util.extendWithWrap(obj, {
                    build: function(data) {
                        return data;
                    }
                });

            }

        }
    ])
    .service('BehavesAllData', [
        '$injector',
        'Util',
        function($injector, Util) {

            return function(obj, def) {

                var BuilderService = $injector.get(def.module + 'Builder');

                return BuilderService.build({})

            }

        }
    ])
    .service('BehavesAllLogic', [
        '$injector',
        'Util',
        function($injector, Util) {

            return function(obj, def) {

                var BuilderService = $injector.get(def.module + 'Builder'),
                    DataService = $injector.get(def.module + 'Data');

                return Util.extendWithWrap(obj, {
                    data: function(path) {
                        return DataService.data(path);
                    },
                    refresh: function() {},
                    onTick: function(tick) {},
                    onGameRestart: function() {
                        BuilderService.build(DataService);
                    }
                });

            }

        }
    ])
;
