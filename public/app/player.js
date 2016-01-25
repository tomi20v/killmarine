angular.module('Player', [
    'Saver',
    'Items',
    'Util',
    'BigNum',
    'Monsters',
    'Ticker',
    'Meta'
])
    .service('Player', function(Util, PlayerData) {

        return {
            data: function(index) {
                return Util.lookUp(PlayerData, index);
            }
        };

    })
    .service('PlayerData', function(Util, UtilData, ItemsBackpack, PlayerLoader) {

        var data = {
            frags: 10,
            backpack: ItemsBackpack.instance()
        };

        UtilData.buildDataTotalAndGame(data);

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

                //PlayerData.frags += frags;
                //PlayerData.game.sum.frags += frags;
                //// total frags gained
                //PlayerData.total.sum.frags+= frags;
                //
                //
                //// max frags ina game
                //PlayerData.max('game.top.frags', PlayerData.frags);
                //// max frags gained in a game
                //PlayerData.max('total.top.frags', PlayerData.frags);
                //
                //var backpack = ItemsBackpack.getRandom(eventData.level),
                //    clippedBackpack = ItemsBackpack.add(PlayerData.backpack, backpack);
                //ItemsBackpack.add(PlayerData.game.sum.backpack, clippedBackpack);
                //ItemsBackpack.add(PlayerData.total.sum.backpack, clippedBackpack);

                PlayerData.topsAdd('frags', frags);

                // backpack max in one game
                // backpack max gained in one game

                // backpack gained total

            },
            onMonsterBuy: function(event, eventData) {
                if (eventData.frags) {
                    var frags = eventData.frags;
                    PlayerData.frags = Math.max(0, PlayerData.frags - frags);
                }
            }
        };

    })
    .run(function($rootScope, PlayerLogic) {
        $rootScope.$on('Marine.die', angular.bind(PlayerLogic, PlayerLogic.onMarineDie));
        $rootScope.$on('Monster.bought', angular.bind(PlayerLogic, PlayerLogic.onMonsterBuy));
    })
    .controller('PlayerScoreboard', function(
        $scope, $rootScope, $timeout,
        Util, UtilConfig, Ticker,
        Player, MonstersData, Meta
    ) {

        angular.merge($scope, {
            player: angular.bind(Player, Player.data),
            monsters: function(index) {
                return Util.lookUp(MonstersData, index);
            },
            meta: angular.bind(Meta, Meta.data),
            pcnt: function(p, all) {
                var pcnt = all == 0
                    ? 0
                    : p / all * 100;
                return Math.round(pcnt, 2);
            }
        });

    })
    .controller('PlayerBackpack', function($scope, $rootScope, PlayerData) {

        angular.merge($scope, {
            items: function(what) {
                //return PlayerData.data('backpack.items.' + what) || 0;
                return PlayerData.backpack.items[what] || 0;
            },
            onMax: function(what) {
                //return PlayerData.data('backpack.max.' + what) &&
                //    PlayerData.data('backpack.items.' + what) == PlayerData.data('backpack.max.' + what);
                return PlayerData.backpack.max[what] &&
                    PlayerData.backpack.items[what] == PlayerData.backpack.max[what];
            }
        });

    })
;
