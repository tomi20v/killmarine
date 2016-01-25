angular.module('Ticker', ['Util', 'Player', 'Monsters', 'Items'])
    .service('Ticker', function($rootScope, UtilMath, Player, PlayerData, Monsters, ItemsBackpack) {

        var tickProto = {
            tick: {
                seq: 0,
                tstamp: null,
                processTime: 0
            },
            availableAmmo:{},
            monsters: {},
            backpack: ItemsBackpack.instance(),
            clippedBackpack: null,
            frags: {
                hit: 0,
                shoot: 0,
                total: 0
            }
        };

        function calculateMonsters(tick, monstersData) {

            angular.forEach(monstersData.owned, function(monsterCnt, monsterId) {

                if (monsterCnt) {

                    var monsterDef = monstersData.defs[monsterId],
                        ammoId = monsterDef.ammo,
                        ammoUsed = Math.min(
                            Math.floor(monsterDef.aps * Math.pow(1.1, monsterCnt)),
                            tick.availableAmmo.items[ammoId] - (tick.availableAmmo.items[ammoId] % monsterDef.aps)
                        ),
                        shootingCnt = ammoUsed / monsterDef.aps,
                        hittingCnt = monsterCnt - shootingCnt
                    ;

                    tick.monsters[monsterId] = {
                        cnt: {
                            hitting: hittingCnt,
                            shooting: shootingCnt,
                            total: monsterCnt
                        },
                        ammoUsed: ammoUsed
                    };

                    tick.availableAmmo.items[ammoId] -= ammoUsed;

                }

            })

        }

        function calculateFrags(tick, data, monsterDef) {

            var hitFrags = UtilMath.randomInt(0, data.cnt.hitting * monsterDef.fps.hit),
                shootFrags = UtilMath.randomInt(0, data.cnt.shooting * monsterDef.fps.shoot)
                ;

            data.frags =  {
                hit: hitFrags,
                shoot: shootFrags,
                total: hitFrags + shootFrags
            };

            tick.frags.hit+= hitFrags;
            tick.frags.shoot+= shootFrags;
            tick.frags.total+= hitFrags + shootFrags;

        }

        function calculateBackpacks(tick) {
            angular.forEach(tick.monsters, function(data, monsterId) {
                var backpack = ItemsBackpack.getRandom(1);
                tick.monsters[monsterId].backpack = backpack;
                ItemsBackpack.add(tick.backpack, backpack);
            });
        }

        var oldTick = {
            tick: {
                seq: 0
            }
        };

        return function() {

            var tick = angular.copy(tickProto);

            tick.tick.tstamp = new Date().getTime();
            tick.tick.seq = oldTick.tick.seq + 1;

            tick.availableAmmo = angular.copy(Player.data('backpack'));

            calculateMonsters(tick, Monsters.data);

            angular.forEach(tick.monsters, function(data, monsterId) {
                calculateFrags(tick, data, Monsters.data.defs[monsterId]);
            });

            calculateBackpacks(tick);

            //Player.data.frags+= tick.frags.total;
            // @TODO refactor this so player module will pick it up from tick event
            PlayerData.topsAdd('frags', tick.frags.total);
            ItemsBackpack.add(Player.data('backpack'), tick.backpack);

            tick.processTime = new Date().getTime() - tick.tstamp;

            oldTick = tick;

            $rootScope.$emit('tick', tick);

        }

    })
    .run(function($interval, $rootScope, UtilConfig, Ticker) {

        function start() {
            return $interval(Ticker, 1000);
        }

        var tickerPromise;
        UtilConfig.pause = true;
        tickerPromise = start();
        UtilConfig.pause = false;

        $rootScope.$on('Game.pause', function() {
            $interval.cancel(tickerPromise);
            UtilConfig.pause = true;
        });

        $rootScope.$on('Game.resume', function() {
            tickerPromise = start();
            UtilConfig.pause = false;
        });

    })
;
