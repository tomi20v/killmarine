angular.module('Meta', ['Util'])
    .service('Meta', function(UtilData, MetaData) {

        return UtilData.buildDataGetterService(MetaData);

    })
    .service('MetaData', function(UtilData, MetaLoader) {

        var data = {
            clicks: 0,
            usefulClicks: 0,
            playTime: 0,
            gameStamp: null,
            sessionStamp: null,
            firstStamp: null
        };

        UtilData.buildDataTotal(data, ['clicks', 'usefulClicks', 'playTime']);

        MetaLoader(data);

        return data;

    })
    .service('MetaLoader', function(Saver) {

        var saveKey = 'Meta';

        return function(data) {

            var stamp = new Date();

            Saver.register(saveKey, data);

            angular.merge(data, {
                sessionStamp: angular.copy(stamp),
                gameStamp: angular.copy(stamp),
                firstStamp: stamp
            }, Saver.load(saveKey));

        }

    })
    .service('MetaLogic', function(MetaData) {

        return {
            onUsefulClick: function(){
                MetaData.topsAdd('usefulClicks', 1);
            },
            onClick: function () {
                MetaData.topsAdd('clicks', 1);
            },
            onTick: function(tick) {
                MetaData.topsAdd('playTime', 1);
            }
        }

    })
    .run(function($rootScope, $document, MetaLogic) {
        $rootScope.$on('Meta.usefulClick', angular.bind(MetaLogic, MetaLogic.onUsefulClick));
        $document.on('click', angular.bind(MetaLogic, MetaLogic.onClick));
        $document.on('Ticker.tick', angular.bind(MetaLogic, MetaLogic.onTick));
    })
;
