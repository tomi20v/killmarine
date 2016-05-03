angular.module('Meta', ['Util'])
    .constant('MetaDef', {
        module: 'Meta'
    })
    .service('Meta', [
        'Behaves',
        'MetaDef',
        function(Behaves, MetaDef) {

            return Behaves.build(MetaDef, 'Service');

        }
    ])
    .service('MetaData', function(UtilData, MetaLoader) {

        var data = {
            clicks: 0,
            usefulClicks: 0,
            gameTime: 0,
            playTime: 0,
            sessionTime: 0,
            fps: 0,
            gameStamp: null,
            sessionStamp: null,
            firstStamp: null
        };

        UtilData.buildDataTop(data, [
            'clicks',
            'usefulClicks',
            'gameTime',
            'playTime',
            'sessionTime',
            'fps'
        ]);

        MetaLoader(data);

        return data;

    })
    .service('MetaLoader', function(Saver) {

        var saveKey = 'Meta';

        return function(data) {

            var stamp = new Date().getTime();

            Saver.register(saveKey, data);

            angular.merge(data, {
                gameTime: 0,
                playTime: 0,
                sessionTime: 0,
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
                MetaData.topsAdd('gameTime', 1);
                MetaData.topsAdd('playTime', 1);
                MetaData.topsAdd('sessionTime', 1);
                MetaData.fps = tick.fps;
                Util.deepSetMax(MetaData, 'tops.top.fps', tick.fps);
            },
            onGameRestart: function() {
                angular.merge(MetaData, {
                    gameTime: 0,
                    playTime: 0,
                    fps: 0,
                    clicks: 0,
                    usefulClicks: 0,
                    gameStamp: new Date().getTime()
                });
            }
        }

    })
    .run(function($rootScope, $document, MetaLogic) {
        $rootScope.$on('Meta.usefulClick', MetaLogic.onUsefulClick);
        $rootScope.$on('Ticker.tick', MetaLogic.onTick);
        $rootScope.$on('Game.restart', MetaLogic.onGameRestart);
        $document.on('click', angular.bind(MetaLogic, MetaLogic.onClick));
    })
;
