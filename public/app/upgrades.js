angular.module('Upgrades', ['Util'])
    .service('UpgradesDef', function() {

        return {
            upgrades: {
                upgrades1: {
                    name: 'Upgrades #1',
                    description: 'Unlocks upgrades',
                    price: 1
                },
                chainShaw: {
                    name: 'Chainshaw',
                    description: 'Triple meelee frags',
                    price: 666*1e6,
                    requires: ['upgrades1']
                },
                shotgun: {
                    name: 'Shotgun',
                    description: 'Enable shotgun in the marine shootout. Also doubles Sargeant frags',
                    price: 1e3,
                    requires: ['upgrades1'],
                    reqCallback: function (d) {
                        return (
                                d.Monsters.data('owned.sarge') || 0
                            ) > 25;
                    }
                },
                weaponCollector: {
                    name: 'Weapon collector',
                    description: 'blah',
                    price: 10e8,
                    requires: ['chainShaw', 'shotgun', 'rocket', 'plasma', 'bfg']
                },
                biggerBullets: {
                    name: 'Bigger bullets',
                    description: 'Increase shooting frags by 100%',
                    price: 1e9+1,
                    requires: ['upgrades1'],
                    reqs: function (d) {
                        // return sum of 'bullet' tagged monsters
                        return (d.Monsters.data('owned.zomb') || 0 +
                            d.Monsters.data('owned.sarg') || 0 +
                            d.monsters.data('owned.cmmd') || 0) > 100;
                    }
                },
                rocket: {
                    name: 'Rocket!',
                    description: 'Enable rocket and rocket using monsters',
                    price: 10e6,
                    requires: ['upgrades1']
                },
                biggerRockets: {
                    name: 'Bigger rockets',
                    description: 'Increase shooting frags by 1000%',
                    price: 10e18,
                    requires: ['upgrades1','rocket'],
                    reqs: function (d) {
                        return (d.Monsters.data('owned.imp') || 0) > 1000;
                    }
                },
                clickAround: {
                    name: 'Let me click',
                    description: 'Increase click hits by 100%',
                    price: 1,
                    requires: ['upgrades1'],
                    reqCallback: function (d) {
                        return d.Meta.data('usefulClicks') > 10;
                    }
                },
                clickMePlenty: {
                    name: 'Click me plenty!',
                    description: 'Increase FPS based on number of clicks in this game',
                    price: 1e9,
                    requires: ['clickAround'],
                    reqCallback: function (d) {

                    }
                },
                clickMare: {
                    name: 'Clickmare',
                    description: 'Each hit on the marine will count as 100 hits',
                    price: 1,
                    requires: ['upgrades1', 'clickMePlenty'],
                    reqCallback: function (d) {
                        // register usefulclicks / clicks for an hour and compare
                    }
                }
            }
        }
    })
    .service('Upgrades', function(UtilData, UpgradesData) {

        return UtilData.buildDataGetterService(UpgradesData);

    })
    .service('UpgradesData', function(
        UtilData, UpgradesLoader, UpgradesDef
    ) {

        var data = {
            owned: [],
            buyTimes: {},
            available: [],
            defs: {}
        };

        angular.forEach(UpgradesDef, function(value, key) {
            data.owned[key] = 0;
        });

        UtilData.buildDataTotal(data);

        UpgradesLoader(data);

        angular.extend(data, {
            defs: {
                upgrades: angular.copy(UpgradesDef.upgrades)
            }
        });

        return data;

    })
    .service('UpgradesLoader', function(Util, Saver) {

        var saveKey = 'Upgrades';

        return function(data) {

            Saver.register(saveKey, data, ['owned', 'buyTimes', 'tops']);

            angular.merge(data, Saver.load(saveKey));

        }

    })
    .service('UpgradesLogic', function(
        $rootScope, $timeout, UtilData, UpgradesDef, UpgradesData, Upgrades, Monsters, Player, Meta
    ) {

        var service = {
            available: function(upgradeId) {
                return UpgradesData.available.indexOf(upgradeId) != -1;
            },
            owned: function(upgradeId) {
                return UpgradesData.owned.indexOf(upgradeId) != -1;
            },
            ownedAll: function(upgradeIds) {
                var allOwned = true;
                if (upgradeIds) {
                    angular.forEach(upgradeIds, function(requiredId) {
                        if (UpgradesData.owned.indexOf(requiredId) == -1) {
                            allOwned = false;
                        }
                    });
                }
                return allOwned;
            },
            refresh: function() {

                var othis = this;

                function becomesAvailable(key) {
                    UpgradesData.available.push(key);
                }

                angular.forEach(UpgradesDef.upgrades, function(value, key) {

                    if (othis.owned(key) || othis.available(key));
                    else if (!othis.ownedAll(value.requires));
                    else if (angular.isFunction(value.reqCallback)) {
                        var d = {
                            Upgrades: Upgrades,
                            Monsters: Monsters,
                            Meta: Meta
                        };
                        if (value.reqCallback(d)) {
                            becomesAvailable(key);
                        }
                    }
                    else {
                        becomesAvailable(key);
                    }
                });
            },
            nextPrice: function(upgradeId) {
                return UpgradesData.defs.upgrades[upgradeId].price;
            },
            canBuy: function(upgradeId) {
                return Player.canBuy(this.nextPrice(upgradeId));
            },
            buy: function(upgradeId, callback) {
                if (this.canBuy(upgradeId)) {
                    buy(upgradeId, callback)
                }
            },
            buyAll: function(callback) {
                angular.forEach(UpgradesData.available, function(upgradeId) {
                    buy(upgradeId, callback);
                })
            }
        },
        buy = function(upgradeId, callback) {

            if (service.owned(upgradeId) || !service.available(upgradeId)) {
                return;
            }

            var price = UpgradesData.defs.upgrades[upgradeId].price;

            // I'm not sure why but I have to timeout this $emit otherwise angular.forEach()
            //      breaks in caller method (WTF)
            $timeout(function() {
                $rootScope.$emit('Player.spend', {
                    frags: price,
                    callback: function () {

                        UpgradesData.owned.push(upgradeId);
                        UpgradesData.available.splice(UpgradesData.available.indexOf(upgradeId), 1);

                        callback();

                        $rootScope.$emit('Upgrades.bought', {
                            id: upgradeId,
                            cnt: 1
                        });

                        service.refresh();

                    }
                });
            })

        };

        return service;

    })
    .run(function($rootScope, UpgradesLogic) {
        $rootScope.$on('Ticker.tick', angular.bind(UpgradesLogic, UpgradesLogic.refresh));
    })
    .controller('UpgradesController', function($scope, $rootScope, Util, UtilBoot, UpgradesData, UpgradesLogic, Player) {

        var usefulBuy = function() {
            $rootScope.$emit('Meta.usefulClick');
        };

        angular.extend($scope, UtilBoot.activeTabMixin(), {
            activeTab: 'available',
            allPrice: function() {
                var allPrice = 0;
                angular.forEach(UpgradesData.available, function(upgradeId) {
                    allPrice+= UpgradesLogic.nextPrice(upgradeId);
                });
                return allPrice;
            },
            canBuyAll: function() {
                var allPrice = this.allPrice();
                return allPrice && Player.canBuy(allPrice);
            },
            buyAll: function() {
                UpgradesLogic.buyAll(usefulBuy);
            },
            availableUpgrades: function() {
                return UpgradesData.available;
            },
            ownedUpgrades: function() {
                return UpgradesData.owned;
            },
            ownedCnt: function() {
                return (Object.keys(UpgradesData.owned).length-1) || '-';
            },
            upgrade: function(upgradeId) {
                return UpgradesData.defs.upgrades[upgradeId] || {};
            },
            nextPrice: function(upgradeId) {
                return UpgradesLogic.nextPrice(upgradeId);
            },
            canBuy: function(upgradeId) {
                return this.activeTab == 'available' && UpgradesLogic.canBuy(upgradeId);
            },
            buy: function(upgradeId) {
                UpgradesLogic.buy(upgradeId, usefulBuy);
            }
        });

    })
;
