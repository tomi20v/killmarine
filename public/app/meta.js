angular.module('Meta', ['Util'])
    .service('Meta', function(UtilData, MetaData) {

        return UtilData.buildDataGetterService(MetaData);

    })
    .service('MetaData', function(UtilData, MetaLoader) {

        var data = {
            clicks: 0,
            usefulClicks: 0,
            playtime: 0
        };

        UtilData.buildDataTotal(data);

        MetaLoader(data);

        return data;

    })
    .service('MetaLoader', function(Saver) {

        var saveKey = 'Meta';

        return function(data) {

            Saver.register(saveKey, data);

            angular.merge(data, Saver.load(saveKey));

        }

    })
    .service('MetaLogic', function(MetaData) {

        return {
            onUsefulClick: function(){
                MetaData.topsAdd('usefulClicks', 1);
            },
            onClick: function () {
                MetaData.topsAdd('clicks', 1);
            }
        }

    })
    .run(function($rootScope, $document, MetaLogic) {
        $rootScope.$on('Meta.usefulClick', angular.bind(MetaLogic, MetaLogic.onUsefulClick));
        $document.on('click', angular.bind(MetaLogic, MetaLogic.onClick));
    })
;
