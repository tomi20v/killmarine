angular.module('Ticker', ['Util', 'Player', 'Monsters', 'Items'])
    // ticker's architecture is an exception to the rest, it is completely closed and exposes only
    // one function, to execute a tick
    .service('TickCalculator', function(UtilMath, ItemsBackpack) {

        var fpsSamples = 1,
            maxFpsSamples = 25,
            frags = {
                hit: function (cnt, fps) {
                    var guaranteed = 0.5;
                    return UtilMath.randomInt(cnt * fps * guaranteed, cnt * fps);
                },
                shoot: function (cnt, fps) {
                    var guaranteed = 0.5;
                    return UtilMath.randomInt(cnt * fps * guaranteed, cnt * fps);
                }
            };

        return {
            calculateMonsterAttacks: function(tick, Monsters) {

                angular.forEach(Monsters.data('owned'), function (monsterCnt, monsterId) {

                    if (monsterCnt) {

                        var monsterDef,
                            ammoId,
                            ammoIfAllShoots,
                            ammoMaxAvail,
                            ammoUsed,
                            shootingCnt,
                            hittingCnt;

                        monsterDef = Monsters.data(['defs', monsterId]);
                        ammoId = monsterDef.ammo;

                        if (ammoId) {

                            if (!monsterDef.aps) {
                                console.log('NOTICE missing monster def');
                                return;
                            }

                            ammoIfAllShoots = Math.floor(monsterDef.aps * monsterCnt);
                            ammoMaxAvail = tick.availableAmmo.items[ammoId] -
                                (tick.availableAmmo.items[ammoId] % monsterDef.aps);
                            ammoUsed = Math.min(ammoIfAllShoots, ammoMaxAvail);

                            shootingCnt = ammoUsed / monsterDef.aps;
                            hittingCnt = monsterCnt - shootingCnt;

                            tick.availableAmmo.items[ammoId] -= ammoUsed;
                            tick.backpack.items[ammoId] -= ammoUsed;

                        }
                        else {

                            ammoUsed = 0;
                            shootingCnt = 0;
                            hittingCnt = monsterCnt;

                        }

                        tick.monsters[monsterId] = {
                            cnt: {
                                hitting: hittingCnt,
                                shooting: shootingCnt,
                                total: monsterCnt
                            },
                            ammoUsed: ammoUsed
                        };

                    }

                })

            },
            calculateFrags: function(tick, Monsters) {
                var othis = this;
                angular.forEach(tick.monsters, function(data, monsterId) {
                    othis.calculateDataFrag(data, Monsters.data(['defs', monsterId]));
                    othis.calculateTickFrag(tick, data);
                });
            },
            calculateDataFrag: function(data, monsterDef) {

                var hitFrags = frags.hit(data.cnt.hitting, monsterDef.fps.hit),
                    shootFrags = frags.shoot(data.cnt.shooting, monsterDef.fps.shoot);

                data.frags = {
                    hit: hitFrags,
                    shoot: shootFrags,
                    total: hitFrags + shootFrags
                };

            },
            calculateTickFrag: function(tick, data) {

                tick.frags.hit += data.frags.hit;
                tick.frags.shoot += data.frags.shoot;
                tick.frags.total += data.frags.hit + data.frags.shoot;

            },
            calculateBackpacks: function(tick, Monsters) {

                angular.forEach(tick.monsters, function (data, monsterId) {
                    var monster = Monsters.data(['defs', monsterId]),
                        backpack = ItemsBackpack.getRandomBySample(monster.backpack, data.frags.total);
                    console.log(backpack);
                    tick.monsters[monsterId].backpack = backpack;
                    tick.backpack.add(backpack);
                });

            },
            calculateFps: function(tick, oldTick) {

                tick.fps = Math.floor((oldTick.fps *(fpsSamples - 1) + tick.frags.total)/fpsSamples);

                // increase samples only if samples < frags because with low frags and high samples it is too biased
                if ((fpsSamples < tick.fps) && (fpsSamples < maxFpsSamples)) {
                    fpsSamples++;
                    tick.fps = Math.floor((tick.fps *(fpsSamples - 1) + tick.frags.total)/fpsSamples);
                }

            },
            resetFpsSamples: function() {

                fpsSamples = 3;

            }
        }

    })
    .service('Ticker', function($rootScope, ItemsBackpack, Player, Monsters, TickerLoader, TickCalculator) {

        var tickProto = {
                tick: {
                    seq: 0,
                    tstamp: null,
                    processTime: 0
                },
                availableAmmo: {},
                monsters: {},
                backpack: ItemsBackpack.instance(),
                clippedBackpack: null,
                frags: {
                    hit: 0,
                    shoot: 0,
                    total: 0
                },
                fps: 0
            },
            oldTickProto = {
                tick: {
                    seq: 0
                },
                fps: 0
            },
            oldTick = {},
            logic = {
                initOldTick: function() {
                    oldTick = angular.merge({}, oldTickProto);
                },
                onGameRestart: function() {
                    this.initOldTick();
                }
            };

        logic.initOldTick();

        TickerLoader(oldTick);

        $rootScope.$on('Game.restart', angular.bind(logic, logic.onGameRestart));
        $rootScope.$on('Monsters.bought', angular.bind(TickCalculator, TickCalculator.resetFpsSamples));
        $rootScope.$on('Upgrades.bought', angular.bind(TickCalculator, TickCalculator.resetFpsSamples));

        return function() {

            var tick = angular.copy(tickProto);

            tick.tick.tstamp = new Date().getTime();
            tick.tick.seq = oldTick.tick.seq + 1;

            tick.availableAmmo = angular.copy(Player.data('backpack'));
            tick.ammoUsed = ItemsBackpack.instance();

            TickCalculator.calculateMonsterAttacks(tick, Monsters);
            TickCalculator.calculateFrags(tick, Monsters);
            TickCalculator.calculateFps(tick, oldTick);
            TickCalculator.calculateBackpacks(tick, Monsters);

            tick.tick.processTime = new Date().getTime() - tick.tick.tstamp;

            oldTick = tick;

            $rootScope.$emit('Ticker.tick', tick);

        }

    })
    .service('TickerLoader', function(Saver) {

        return function(tick) {
            var data = Saver.load('Meta');
            tick.tick.seq = data.playTime || 0;
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
