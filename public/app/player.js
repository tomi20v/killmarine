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

        data.backpack.max.clip = 200;
        data.backpack.max.shell = 50;

        PlayerLoader(data);

        return data;

    })
    .service('PlayerLoader', function(Saver) {

        var saveKey = 'Player';

        return function(data) {

            Saver.register(saveKey, data);

            angular.merge(data, Saver.load(saveKey));

        }

    })
    .service('PlayerLogic', function(Util, ItemsBackpack, PlayerData) {

        return {
            onMarineDie: function(event, eventData) {

                // @todo I should receive many frags depending on player level?
                var frags = 1;

                //var backpack = ItemsBackpack.getRandom(eventData.level),
                //    clippedBackpack = ItemsBackpack.add(PlayerData.backpack, backpack);
                //ItemsBackpack.add(PlayerData.game.sum.backpack, clippedBackpack);
                //ItemsBackpack.add(PlayerData.total.sum.backpack, clippedBackpack);

                PlayerData.topsAdd('frags', frags);

                // backpack max in one game
                // backpack max gained in one game

                // backpack gained total

            },
            onSpend: function(event, eventData) {
                if (eventData.frags <= PlayerData.frags) {
                    PlayerData.frags = PlayerData.frags - eventData.frags;
                    if (eventData.callback) {
                        eventData.callback();
                    }
                }
            }
        };

    })
    .run(function($rootScope, PlayerLogic) {
        $rootScope.$on('Marine.die', angular.bind(PlayerLogic, PlayerLogic.onMarineDie));
        $rootScope.$on('Player.spend', angular.bind(PlayerLogic, PlayerLogic.onSpend));
    })
    //.controller('PlayerBackpack', function($scope, $rootScope, PlayerData) {
    //
    //    angular.merge($scope, {
    //        items: function(what) {
    //            //return PlayerData.data('backpack.items.' + what) || 0;
    //            return PlayerData.backpack.items[what] || 0;
    //        },
    //        onMax: function(what) {
    //            //return PlayerData.data('backpack.max.' + what) &&
    //            //    PlayerData.data('backpack.items.' + what) == PlayerData.data('backpack.max.' + what);
    //            return PlayerData.backpack.max[what] &&
    //                PlayerData.backpack.items[what] == PlayerData.backpack.max[what];
    //        }
    //    });
    //
    //})
;
