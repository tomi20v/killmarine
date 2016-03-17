/**
 * common behaviours, automatically added in all Behaves.build() calls
 * all service types defined here (Public, Data, Builder, Logic, Run)
 */
angular.module('BehavesAll', ['Util'])
    /**
     * Public - this shall be the only publicly used service of the module
     * all other modules should get data through data() method so it can
     *      apply modifiers as needed
     */
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
    /**
     * Builder - to be executed on init and on game restart and is to
     *      build the Data service itself. it is just decoupling build logic
     *      from Data object which normally doesn't need this
     */
    .service('BehavesAllBuilder', [
        'Util',
        function(Util) {

            return function(obj, def) {

                return Util.extendWithWrap(obj, {
                    build: function(data) {
                        data.module = def.module;
                        return data;
                    }
                });

            }

        }
    ])
    /**
     * Data - shall hold the module's actual data. If persisted, this data
     *      will be saved. Own module can access Data service directly but
     *      other modules should not (use the public service instead)
     */
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
    /**
     * Logic - to contain all logic regarding the module. Controllers will
     *      bind to this, event listeners also.
     */
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
                    onTick: function(tick) {
                        this.refresh();
                    },
                    onGameRestart: function() {
                        BuilderService.build(DataService);
                    }
                });

            }

        }
    ])
    /**
     * Run - automatic runs, mostly to register behaviour specific listeners
     */
    .service('BehavesAllRun', [
        '$injector',
        '$rootScope',
        function($injector, $rootScope) {

            return function(def) {

                var LogicService = $injector.get(def.module + 'Logic');

                LogicService.onGameRestart();

                $rootScope.$on('Game.restart', angular.bind(LogicService, LogicService.onGameRestart));
                $rootScope.$on('Ticker.tick', angular.bind(LogicService, LogicService.onTick));

            }

        }
    ])
    /**
     * Controller - to specify controller mixins. this is an empty sample, could be removed
     */
    .service('BehavesAllController', [
        function() {

            return function(obj, def) {
                return obj;
            }

        }
    ])
;
