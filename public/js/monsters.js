angular.module('Monsters', ['Player'])
    .constant('MonstersDef', {
        monsters: {
            zomb: {
                name: 'Zombieman',
                id: 'zomb',
                price: 5,
                q: 1.03,
                fps: {
                    hit: 1,
                    shoot: 2
                },
                backpackLevel: 1,
                ammo: 'clip',
                aps: 1,
                available: true,
                tags: ['all', 'zomb']
            },
            sarg: {
                name: 'Sargeant',
                id: 'sarg',
                price: 20,
                q: 1.04,
                fps: {
                    hit: 1,
                    shoot: 4
                },
                backpackLevel: 1,
                ammo: 'shell',
                aps: 1,
                available: true,
                tags: ['all', 'sarg']
            },
            cmmd: {
                name: 'Commando',
                id: 'cmmd',
                price: 70,
                q: 1.06,
                fps: {
                    hit: 1,
                    shoot: 10
                },
                backpackLevel: 1,
                ammo: 'clip',
                aps: 3,
                available: false,
                tags: ['all', 'cmmd']
            },

            imp: {
                name: 'Imp',
                id: 'imp',
                price: 30,
                q: 1.08,
                fps: {
                    hit: 2,
                    shoot: 10
                },
                backpackLevel: 1,
                ammo: 'rocket',
                aps: 1,
                available: true,
                tags: ['all', 'imp']
            },
            manc: {
                name: 'Mancubus',
                id: 'manc',
                price: 600,
                q: 1,
                fps: {
                    hit: 24,
                    shoot: 64
                },
                backpackLevel: 1,
                ammo: 'rocket',
                available: false,
                tags: ['all', 'manc']
            },
            rev: {
                name: 'Revenant',
                id: 'rev',
                price: 300,
                q: 1,
                fps: {
                    hit: 10,
                    shoot: 80
                },
                backpackLevel: 1,
                ammo: 'rocket',
                available: false,
                tags: ['all', 'rev']
            },

            caco: {
                name: 'Cacodemon',
                id: 'caco',
                price: 400,
                q: 1,
                fps: {
                    hit: 10,
                    shoot: 40
                },
                backpackLevel: 1,
                ammo: 'rocket',
                available: false,
                tags: ['all', 'caco']
            },
            hell: {
                name: 'Hell Knight',
                id: 'hell',
                price: 500,
                q: 1,
                fps: {
                    hit: 10,
                    shoot: 64
                },
                backpackLevel: 1,
                ammo: 'rocket',
                aps: 1,
                available: false,
                tags: ['all', 'hell']
            },
            baro: {
                name: 'Baron of hell',
                id: 'baro',
                price: 1000,
                fps: {
                    hit: 10,
                    shoot: 80
                },
                backpackLevel: 1,
                ammo: 'rocket',
                available: false,
                tags: ['all', 'baro']
            },

            demn: {
                name: 'Demon',
                id: 'demn',
                price: 5000,
                q: 1,
                fps: {
                    hit: 40,
                    shoot: null
                },
                backpackLevel: 1,
                ammo: null,
                aps: null,
                available: false,
                tags: ['all', 'demn']
            },
            lost: {
                name: 'Lost Soul',
                id: 'lost',
                price: 100,
                q: 1,
                fps: {
                    hit: 24,
                    shoot: null
                },
                backpackLevel: 1,
                ammo: null,
                aps: null,
                available: false,
                tags: ['all', 'lost']
            },
            arch: {
                name: 'Arch-Vile',
                id: 'arch',
                price: 700,
                q: 1,
                fps: {
                    hit: 20,
                    shoot: 70
                },
                backpackLevel: 1,
                ammo: null,
                available: false,
                tags: ['all', 'arch']
            },

            spdm: {
                name: 'Spiderdemon',
                id: 'spdm',
                price: 3000,
                q: 1,
                fps: {
                    hit: 0,
                    shoot: 650
                },
                backpackLevel: 1,
                ammo: 'plasma',
                available: false,
                tags: ['all', 'spdm']
            },
            artr: {
                name: 'Arachnotron',
                id: 'artr',
                price: 500,
                q: 1,
                fps: {
                    hit: 5,
                    shoot: 40
                },
                backpackLevel: 1,
                ammo: 'plasma',
                aps: 1,
                available: false,
                tags: ['all', 'artr']
            },
            cybd: {
                name: 'Cyberdemon',
                id: 'cybd',
                price: 4000,
                q: 1,
                fps: {
                    hit: 0,
                    shoot: 800
                },
                backpackLevel: 1,
                ammo: 'plasma',
                available: false,
                tags: ['all', 'cybd']
            },

            icon: {
                name: 'Icon of Sin',
                id: 'icon',
                price: 10000,
                fps: {
                    hit: 0,
                    shoot: 0
                },
                backpackLevel: 1,
                ammo: null,
                aps: null,
                available: false,
                tags: ['all', 'icon']
            }
        },
        available: {
            always: ['zomb', 'sarg', 'imp']
        }
    })
    .service('MonstersData', function(UtilBoot, MonstersDef) {

        var data = {
            owned: {},
            // these are cached values, no need to save unless plan changes
            defs: {}
        },
        monsterBuilder = function(monster) {
            var price = monster.price,
                q = monster.q;
            angular.extend(monster, {
                price: function() { return price; },
                q: function() { return q; },
                owned: function() { return data.owned[this.id]}
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
data.owned.zomb = 1;
data.owned.sarg = 1;
        UtilBoot.prepareData(data, ['owned']);

        return data;

    })
    .service('MonstersLogic', function($rootScope, UtilMath, MonstersData, Player) {

        return {
            available: function(monsterId) {
                return MonstersData.defs[monsterId].available;
            },
            nextPrice: function(monsterId, cnt) {
                var owned = MonstersData.owned[monsterId],
                    price = MonstersData.defs[monsterId].price(),
                    q = MonstersData.defs[monsterId].q();
                return Math.floor(UtilMath.sumGeoSeq(price, q, owned + cnt) - UtilMath.sumGeoSeq(price, q, owned));
            },
            maxPrice: function(monsterId) {
                var cnt = this.maxBuyable(monsterId);
                return this.nextPrice(monsterId, cnt);
            },
            maxBuyable: function(monsterId) {
                var owned = MonstersData.owned[monsterId],
                    price = MonstersData.defs[monsterId].price(),
                    q = MonstersData.defs[monsterId].q(),
                    ownedPrice = UtilMath.sumGeoSeq(price, q, owned);
                return UtilMath.seqNBySum(ownedPrice + Player.data.frags, price, q) - owned;
            },
            buy: function(monsterId, cnt) {

                var nextPrice;

                if (!this.available(monsterId)) {
                    return;
                }

                // if (cnt <= this.mayBuyable(monsterId)){
                //  this._buy(monsterId, cnt, this.maxPrice());
                // }

                nextPrice = this.nextPrice(monsterId, cnt);

                if (nextPrice <= Player.data.frags) {
                    this._buy(monsterId, cnt, nextPrice);
                }

            },
            _buy: function(monsterId, cnt, price) {
                var newOwned = MonstersData.owned[monsterId] + cnt;

                MonstersData.owned[monsterId] = newOwned;
                // max of this monster owned in one game
                MonstersData._game.owned[monsterId] = Math.max(MonstersData._game.owned[monsterId], newOwned);
                // total bought of this monster alltime
                MonstersData._total.owned[monsterId]+= cnt;

                $rootScope.$emit('Monster.bought', {
                    id: monsterId,
                    cnt: cnt,
                    frags: price
                });
            }
        };

    })
    .service('Monsters', function($timeout, Util, MonstersDef, MonstersData) {

        return {
            data: angular.bind(Util.lookUp, MonstersData),
            //monster: function(id) {
            //    return angular.filter(MonstersDef.monsters, function(monster) {
            //        return monster.id == id;
            //    }).pop();
            //},
            registerMod: function(event, data) {
                console.log('REGISTER: ', data);
                angular.forEach(MonstersData.defs, function(monster) {
                    // @todo filter here
                    var oldFn = monster[data.path];
                    // @todo convert to empty returner fn if not function
                    monster[data.path] = function() {
                        return data.fn(oldFn);
                    };
                    if (data.timeout) {
                        $timeout(function () {
                            monster[data.path] = oldFn;
                        }, data.timeout);
                    }
                })
            }
        };

    })
    .run(function($rootScope, Monsters) {
        $rootScope.$on('Monsters.registerMod', angular.bind(Monsters, Monsters.registerMod));
    })
    .controller('MonstersController', function($scope, MonstersData, MonstersLogic, PlayerData) {

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
                MonstersLogic.buy(monsterId, cnt);
            }
        },
        buyMaxStrategy = angular.extend(angular.copy(buyStrategy), {
            maxBuyable: function(monsterId, cnt) {
                return MonstersLogic.maxBuyable(monsterId);
            },
            nextPrice: function(monsterId) {
                return MonstersLogic.maxPrice(monsterId) || MonstersLogic.nextPrice(monsterId, 1);
            },
            buy: function(monsterId, cnt) {
                MonstersLogic.buy(monsterId, this.maxBuyable(monsterId));
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
            },
            getAvailableMonsters: function() {
                return MonstersData.defs;
            },
            getOwned: function(monsterId) {
                return MonstersData.defs[monsterId].owned() || 0;
            },
            canBuyNext: function(monsterId) {
                return this.strategy.canBuyNext(monsterId, this.buyAtOnce);
            },
            buy: function(monsterId) {
                this.strategy.buy(monsterId, this.buyAtOnce);
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
