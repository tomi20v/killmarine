angular.module('Player', [
    'Saver',
    'Util',
    'BigNum',
    'Items',
    'Monsters',
    'Ticker',
    'Meta'
])
    .service('Player', function(UtilData, PlayerData) {

        return angular.extend(UtilData.buildDataGetterService(PlayerData), {
            canBuy: function(frags) {
                return frags <= PlayerData.frags;
            }
        });

    })
    .service('PlayerData', function(Util, UtilData, ItemsBackpack, PlayerLoader) {

        var data = {
            frags: 0,
            backpack: ItemsBackpack.instance()
        };

        UtilData.buildDataTopSum(data);

        PlayerLoader(data);

        data.backpack.max.clip = 200;
        data.backpack.max.shell = 50;
        data.backpack.max.rocket = 50;
        data.backpack.max.cell = 300;
        data.backpack.max.plasma = 150;
        data.backpack.max.slug = 75;

        return data;

    })
    .service('PlayerLoader', function(Saver) {

        var saveKey = 'Player';

        return function(data) {

            Saver.register(saveKey, data);

            angular.merge(data, Saver.load(saveKey));

        }

    })
    .service('PlayerLogic', function(Util, PlayerData) {

        return {
            onGameRestart: function() {

                angular.forEach(PlayerData.backpack.items, function(cnt, key) {
                    PlayerData.backpack.items[key] = 0;
                });

            },
            onTick: function(event, tick) {
                PlayerData.topsAdd('frags', tick.frags.total);
                PlayerData.topsAdd('backpack', tick.backpack);
            }
        };

    })
    .run(function($rootScope, PlayerLogic) {

        $rootScope.$on('Game.restart', angular.bind(PlayerLogic, PlayerLogic.onGameRestart));
        $rootScope.$on('Ticker.tick', angular.bind(PlayerLogic, PlayerLogic.onTick));

    })
    .controller('PlayerBackpackController', function($scope, $rootScope, PlayerData) {

        angular.merge($scope, {
            items: function() {
                return PlayerData.backpack.items || 0;
            },
            getMax: function(item) {
                return PlayerData.backpack.max[item] || 0;
            },
            onMax: function(item) {
                var max = this.getMax(item);
                return max && PlayerData.backpack.items[item] == max;
            },
            getWidth: function(item) {
                return 100 * PlayerData.backpack.items[item] / PlayerData.backpack.max[item];
            }
        });

    })
;
