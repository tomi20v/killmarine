angular.module('Monsters')
    .service('Monsters', function(
        $timeout,
        Util,
        MonstersData
    ) {

        return {
            data: angular.bind(Util.lookUp, MonstersData)
        };

    })
    .service('MonstersData', function(
        UtilBoot, UtilData, MonstersDef, MonstersLoader
    ) {

        var data = {
                owned: {},
                ownedAll: 0,
                // these are cached values, no need to save unless plan changes
                defs: {}
            },
            fields = ['owned', 'ownedAll'],
            monsterBuilder = function(monster) {
                var buyable = monster.buyable;
                angular.extend(monster, {
                    buyable: function() {
                        return buyable;
                    }
                });

                return monster;
            };

        angular.forEach(MonstersDef.monsters, function(monster) {
            data.owned[monster.id] = 0;
        });

        angular.forEach(MonstersDef.monsters, function(monster, monsterId) {
            if (monster.available) {
                data.defs[monsterId] = monsterBuilder(angular.copy(monster));
            }
        });

        UtilData.buildDataTotal(data, fields);

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
    .service('MonstersLogic', function($rootScope, UtilData, UtilMath, MonstersData, Player) {

        return {
            available: function(monsterId) {
                return MonstersData.defs[monsterId].available;
            },
            nextPrice: function(monsterId, cnt) {
                var owned = MonstersData.owned[monsterId],
                    price = MonstersData.defs[monsterId].buyable().price,
                    q = MonstersData.defs[monsterId].buyable().q;
                return Math.floor(UtilMath.sumGeoSeq(price, q, owned + cnt) - UtilMath.sumGeoSeq(price, q, owned));
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
                return UtilMath.seqNBySum(ownedPrice + Player.data.frags, price, q) - owned;
            },
            buy: function(monsterId, cnt) {

                var nextPrice;

                if (!this.available(monsterId)) {
                    return false;
                }

                nextPrice = this.nextPrice(monsterId, cnt);

                if (nextPrice <= Player.data.frags) {
                    this._buy(monsterId, cnt, nextPrice);
                }

                return true;

            },
            _buy: function(monsterId, cnt, price) {

                var newOwned = MonstersData.topsAdd(['owned', monsterId], cnt),
                    newTotal = MonstersData.topsAdd(['ownedAll'], cnt);

                $rootScope.$emit('Monster.bought', {
                    id: monsterId,
                    cnt: cnt,
                    allCnt: newTotal,
                    frags: price
                });
            },
            onLoad: function() {
                console.log('monsters onload', this, args);
            }
        };

    })
    .run(function($rootScope, Monsters) {
        $rootScope.$on('Monsters.registerMod', angular.bind(Monsters, Monsters.registerMod));
    })
    .controller('MonstersController', function(
        $scope, $rootScope,
        MonstersData, MonstersLogic, PlayerData
    ) {

        var buyStrategy = {
            maxBuyable: function(monsterId, cnt) {
                return cnt;
            },
            nextPrice: function(monsterId, cnt) {
                return MonstersLogic.nextPrice(monsterId, cnt);
            },
            canBuyNext: function(monsterId, cnt) {
                var nextPrice = this.nextPrice(monsterId, cnt);
                return nextPrice && (nextPrice <= PlayerData.frags);
            },
            buy: function(monsterId, cnt) {
                return MonstersLogic.buy(monsterId, cnt);
            }
        },
        buyMaxStrategy = angular.extend({}, buyStrategy, {
            maxBuyable: function(monsterId, cnt) {
                return MonstersLogic.maxBuyable(monsterId);
            },
            nextPrice: function(monsterId) {
                return MonstersLogic.maxPrice(monsterId) || MonstersLogic.nextPrice(monsterId, 1);
            },
            buy: function(monsterId, cnt) {
                return MonstersLogic.buy(monsterId, this.maxBuyable(monsterId));
            }
        });

        angular.extend($scope, {
            buyAtOnce: 1,
            strategy: buyStrategy,
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
            canBuyNext: function(monsterId) {
                return this.strategy.canBuyNext(monsterId, this.buyAtOnce);
            },
            buy: function(monsterId) {
                var useful = this.strategy.buy(monsterId, this.buyAtOnce);
                $rootScope.$emit('Meta.usefulClick', useful);
            },
            maxBuyable: function(monsterId) {
                return this.strategy.maxBuyable(monsterId, this.buyAtOnce);
            },
            nextPrice: function(monsterId) {
                return this.strategy.nextPrice(monsterId, this.buyAtOnce);
            }
        });

    })
;
