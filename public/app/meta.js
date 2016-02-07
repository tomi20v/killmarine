angular.module('Meta', ['Util'])
    .service('Meta', function(UtilData, MetaData) {

        return UtilData.buildDataGetterService(MetaData);

    })
    .service('MetaData', function(UtilData, MetaLoader) {

        var data = {
            clicks: 0,
            usefulClicks: 0,
            playTime: 0,
            fps: 0,
            gameStamp: null,
            sessionStamp: null,
            firstStamp: null
        };

        UtilData.buildDataTop(data, ['clicks', 'usefulClicks', 'playTime', 'fps']);

        MetaLoader(data);

        return data;

    })
    .service('MetaLoader', function(Saver) {

        var saveKey = 'Meta';

        return function(data) {

            var stamp = new Date().getTime();

            Saver.register(saveKey, data);

            angular.merge(data, {
                sessionStamp: stamp,
                gameStamp: stamp,
                firstStamp: stamp
            }, Saver.load(saveKey));

        }

    })
    .service('MetaLogic', function($rootScope, Util, MetaData) {

        return {
            onUsefulClick: function(){
                MetaData.topsAdd('usefulClicks', 1);
            },
            onClick: function () {
                MetaData.topsAdd('clicks', 1);
                // click comes from document event which wouldn't trigger digest cycle otherwise
                // phase check most probably unnecessary
                //if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                //}
            },
            onTick: function(event, tick) {
                MetaData.topsAdd('playTime', 1);
                MetaData.fps = tick.fps;
                Util.deepSetMax(MetaData, 'tops.top.fps', tick.fps);
            }
        }

    })
    .run(function($rootScope, $document, MetaLogic) {
        $rootScope.$on('Meta.usefulClick', angular.bind(MetaLogic, MetaLogic.onUsefulClick));
        $rootScope.$on('Ticker.tick', angular.bind(MetaLogic, MetaLogic.onTick));
        $document.on('click', angular.bind(MetaLogic, MetaLogic.onClick));
    })
;
