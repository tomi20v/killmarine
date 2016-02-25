angular.module('Monsters')
    .service('Monsters', function(UtilData, MonstersData) {

        return UtilData.buildDataGetterService(MonstersData);

    })
    .service('MonstersBuilder',function(MonstersDef) {

        var monsterBuilder = function(monster) {
            var buyable = monster.buyable;
            angular.extend(monster, {
                buyable: function() {
                    return buyable;
                }
            });

            return monster;
        };

        return function(data) {
            angular.merge(data, {
                owned: {},
                ownedAll: 0,
                // these are cached values, no need to save unless plan changes
                defs: {},
                frags: {
                    byMonstersAll: 0,
                    byMonstersHit: 0,
                    byMonstersShoot: 0,
                    byMonsters: {},
                    byMarineFrags: 0
                }
            });
            angular.forEach(MonstersDef.monsters, function(monster) {
                var monsterCpy = angular.extend({}, MonstersDef.monsterProto, monster);
                data.owned[monster.id] = 0;
                data.defs[monster.id] = monsterBuilder(monsterCpy);
                data.frags.byMonsters[monster.id] = 0;
            });
            return data;
        }

    })
    .service('MonstersData', function(
        UtilData, MonstersBuilder, MonstersLoader
    ) {

        var data = MonstersBuilder({}),
            fields = ['owned', 'ownedAll', 'frags'];

        UtilData.buildDataTopSum(data, fields);

        MonstersLoader(data, fields.concat('tops'));

        return data;

    })
    .service('MonstersLoader', function(Saver) {

        var saveKey = 'Monsters';

        return function(data, saveFields) {

            Saver.register(saveKey, data, saveFields);

            angular.merge(data, Saver.load(saveKey));

            data.ownedAll = 0;
            angular.forEach(data.owned, function (value, key) {
                data.ownedAll += value;
            })

        }

    })
    .service('MonstersLogic', [
        '$rootScope',
        'Util',
        'UtilData',
        'UtilMath',
        'Frags',
        'MonstersDef',
        'MonstersBuilder',
        'MonstersData',
        function(
            $rootScope,
            Util, UtilData, UtilMath, Frags,
            MonstersDef, MonstersBuilder, MonstersData
        ) {

            var buy = function(monsterId, cnt, price) {

                var newOwned = MonstersData.topsAdd(['owned', monsterId], cnt);
                    newTotal = MonstersData.topsAdd(['ownedAll'], cnt);

                $rootScope.$emit('Monsters.bought', {
                    id: monsterId,
                    cnt: cnt,
                    allCnt: newTotal,
                    frags: price
                });
            };

            return {
                available: function(monsterId) {
                    return MonstersData.defs[monsterId].available;
                },
                nextPrice: function(monsterId, cnt) {
                    var owned = MonstersData.owned[monsterId],
                        buyable = (MonstersData.defs[monsterId].buyable || function(){ return {}; }) (),
                        price = buyable.price,
                        q = buyable.q,
                        priceWithNextCnt = UtilMath.sumGeoSeq(price, q, owned + cnt),
                        priceOfowned = UtilMath.sumGeoSeq(price, q, owned);
                    return Math.floor(priceWithNextCnt - priceOfowned);
                },
                maxPrice: function(monsterId) {
                    var cnt = this.maxBuyable(monsterId);
                    return this.nextPrice(monsterId, cnt);
                },
                maxBuyable: function(monsterId) {
                    var owned = MonstersData.owned[monsterId],
                        price = MonstersData.defs[monsterId].buyable().price,
                        q = MonstersData.defs[monsterId].buyable().q,
                        ownedPrice = UtilMath.sumGeoSeq(price, q, owned);
                    return UtilMath.seqNBySum(ownedPrice + Frags.data('owned.frags'), price, q) - owned;
                    //return UtilMath.seqNBySum(ownedPrice + Player.data('frags'), price, q) - owned;
                },
                buy: function(monsterId, cnt, successCallback) {

                    var nextPrice;

                    if (!this.available(monsterId)) {
                        return false;
                    }

                    nextPrice = this.nextPrice(monsterId, cnt);

                    //$rootScope.$emit('Player.spend', {
                    $rootScope.$emit('Frags.spend', {
                        frags: nextPrice,
                        success: function() {
                            buy(monsterId, cnt, nextPrice);
                            if (successCallback) {
                                successCallback();
                            }
                        }
                    });

                },
                onGameRestart: function() {
                    MonstersBuilder(MonstersData);
                },
                onMonsterAvailable: function(event, eventData) {
                    var ids = Util.idsByTags(MonstersData.defs, eventData.tags);
                    angular.forEach(ids, function(id) {
                        MonstersData.defs[id].available = true;
                    });
                },
                onResetOwnedAll: function(event) {
                    angular.forEach(MonstersData.owned, function(cnt, id) {
                        MonstersData.owned[id] = 0;
                    });
                    MonstersData.ownedAll = 0;
                },
                onTick: function(event, tick) {
                    angular.forEach(tick.monsters, function(monster, monsterId) {
                        MonstersData.topsAdd(
                            ['frags', 'byMonsters', monsterId],
                            monster.frags.total
                        );
                    });
                    MonstersData.topsAdd('frags.hit', tick.frags.hit);
                    MonstersData.topsAdd('frags.shoot', tick.frags.shoot);
                    MonstersData.topsAdd('frags.byMonstersAll', tick.frags.hit + tick.frags.shoot);
                }
            };

        }
    ])
    .run(function($rootScope, MonstersLogic) {
        $rootScope.$on('Game.restart', angular.bind(MonstersLogic, MonstersLogic.onGameRestart));
        $rootScope.$on('Monsters.available', angular.bind(MonstersLogic, MonstersLogic.onMonsterAvailable));
        $rootScope.$on('Monsters.resetOwned', angular.bind(MonstersLogic, MonstersLogic.onResetOwnedAll));
        $rootScope.$on('Ticker.tick', angular.bind(MonstersLogic, MonstersLogic.onTick));
    })
    .controller('MonstersController', function(
        $scope, $rootScope,
        MonstersData, MonstersLogic, Frags
    ) {

        var buyStrategy = {
            maxBuyable: function(monsterId, cnt) {
                return cnt;
            },
            nextPrice: function(monsterId, cnt) {
                var p = MonstersLogic.nextPrice(monsterId, cnt);
                return p;
            },
            canBuyNext: function(monsterId, cnt) {
                var nextPrice = this.nextPrice(monsterId, cnt);
                return nextPrice && (nextPrice <= Frags.data('owned.frags'));
            },
            buy: function(monsterId, cnt, callback) {
                return MonstersLogic.buy(monsterId, cnt, callback);
            }
        },
        buyMaxStrategy = angular.extend({}, buyStrategy, {
            maxBuyable: function(monsterId, cnt) {
                return MonstersLogic.maxBuyable(monsterId);
            },
            nextPrice: function(monsterId) {
                return MonstersLogic.maxPrice(monsterId) || MonstersLogic.nextPrice(monsterId, 1);
            },
            buy: function(monsterId, cnt, callback) {
                return MonstersLogic.buy(monsterId, this.maxBuyable(monsterId), callback);
            }
        });

        // @todo reuse the tabs builder
        angular.extend($scope, {
            buyAtOnce: 1,
            strategy: buyStrategy,
            monsterCnt: {},
            shootPcnt: {},
            cycleBuyAtOnce: function() {
                switch (this.buyAtOnce) {
                case 100:
                    this.buyAtOnce = 0;
                    this.strategy = buyMaxStrategy;
                    break;
                case 0:
                    this.buyAtOnce = 1;
                    this.strategy = buyStrategy;
                    break;
                default:
                    this.buyAtOnce*= 10;
                }
                $rootScope.$emit('Meta.usefulClick');
            },
            getAvailableMonsters: function() {
                return MonstersData.defs;
            },
            getOwned: function(monsterId) {
                return MonstersData.owned[monsterId] || 0;
            },
            getShootingClass: function(monsterId) {
                var pcnt = $scope.shootPcnt[monsterId] || 0,
                    cls = {
                        'progress-bar': true,
                        'progress-striped': true
                    };
                if (pcnt > 95) {
                    cls['progress-bar-danger'] = true;
                }
                else if (pcnt > 80) {
                    cls['progress-bar-success'] = true;
                }
                else if (pcnt > 25) {
                    cls['progress-bar-warning'] = true;
                }
                else {
                    cls['progress-bar-danger'] = true;
                }
                return cls;

            },
            getShootingWidth: function(monsterId) {
                return $scope.shootPcnt[monsterId] || 0;
            },
            canBuyNext: function(monsterId) {
                return this.strategy.canBuyNext(monsterId, this.buyAtOnce);
            },
            buy: function(monsterId) {
                this.strategy.buy(
                    monsterId,
                    this.buyAtOnce,
                    angular.bind($rootScope, $rootScope.$emit, 'Meta.usefulClick')
                );
            },
            maxBuyable: function(monsterId) {
                return this.strategy.maxBuyable(monsterId, this.buyAtOnce);
            },
            nextPrice: function(monsterId) {
                return this.strategy.nextPrice(monsterId, this.buyAtOnce);
            }
        });

        $rootScope.$on('Ticker.tick', function(event, tick) {
            angular.forEach(tick.monsters, function(monster, monsterId) {
                $scope.monsterCnt[monsterId] = monster.cnt;
                $scope.shootPcnt[monsterId] = monster.cnt.total
                    ? monster.cnt.shooting / monster.cnt.total * 100
                    : 0;
            })
        });

    })
;
