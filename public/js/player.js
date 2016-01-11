angular.module('Player', ['Items', 'Util', 'BigNum', 'Monsters', 'Ticker'])
    .service('PlayerData', function(Util, UtilBoot, ItemsBackpack) {

        var data = {
            frags: 0,
            backpack: ItemsBackpack.instance(),
            gained: {
                frags: 0
            }
        };

        UtilBoot.prepareData(data);

        data.backpack.max.clip = 200;
        data.backpack.max.shell = 50;

        return UtilBoot.buildData(data);

    })
    .service('PlayerLogic', function(Util, ItemsBackpack, PlayerData) {

        return {
            onMarineDie: function(event, eventData) {

                // @todo I should receive many frags depending on player level?
                var frags = 1;

                PlayerData.frags += frags;
                PlayerData.gained.frags += frags;

                // max frags ina game
                PlayerData.max('_game.frags', PlayerData.frags);
                // max frags gained in a game
                PlayerData.max('_game.gained.frags', PlayerData.gained.frags);

                // total frags gained
                PlayerData._total.gained.frags+= frags;

                var backpack = ItemsBackpack.getRandom(eventData.level),
                    clippedBackpack = ItemsBackpack.add(PlayerData.backpack, backpack);
                ItemsBackpack.add(PlayerData._game.backpack, clippedBackpack);
                ItemsBackpack.add(PlayerData._total.backpack, clippedBackpack);

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
    .service('Player', function(UtilBoot, PlayerData) {

        var service= {
            data: PlayerData
        };

        UtilBoot.buildGetSet(service.data);

        return service;

    })
    .controller('PlayerScoreBoard', function($scope, $rootScope, $timeout, Util, UtilConfig, PlayerData, MonstersData, Ticker) {

        angular.merge($scope, {
            data: function(what) {
                return Util.lookUp(PlayerData, what);
            },
            cheat: function() {
                PlayerData.frags *= 123;
            },
            burn: function() {
                $rootScope.$emit('Monsters.registerMod', {
                    filter: function(monster) {
                        return true;
                    },
                    path: 'price',
                    fn: function(oldFn) {
                        return 0.1 * oldFn();
                    },
                    timeout: 2000
                });
            },
            tick: function() {
                Ticker();
            },
            paused: function() {
                return UtilConfig.paused;
            },
            pause: function() {
                $rootScope.$emit('Game.pause');
            },
            resume: function() {
                $rootScope.$emit('Game.resume');
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
    .run(function($rootScope, PlayerLogic) {
        $rootScope.$on('Marine.die', angular.bind(PlayerLogic, PlayerLogic.onMarineDie));
        $rootScope.$on('Monster.bought', angular.bind(PlayerLogic, PlayerLogic.onMonsterBuy));
    })
;
