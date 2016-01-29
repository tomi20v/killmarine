angular.module('Upgrades', ['Util'])
    .service('UpgradesDef', function() {

        var watchData = {},
            getWatchData = function(key) {
                if (!watchData[key]) {
                    watchData[key] = {};
                }
                return watchData[key];
            };

        return {
            upgrades: {
                upgrades: {
                    name: 'Upgrades!',
                    description: 'Unlocks upgrades.',
                    price: 100
                },
                chainShaw: {
                    name: 'Chainshaw',
                    description: 'Triple meelee frags',
                    price: 10e66,
                    requires: ['upgrades']
                },
                shotgun: {
                    name: 'Shotgun',
                    description: 'Enable shotgun in the marine shootout. Also doubles Sargeant frags',
                    price: 10e3,
                    requires: ['upgrades'],
                    reqs: function (d) {
                        return (
                                d.Monsters.data('owned.sarge') || 0
                            ) > 25;
                    }
                },
                weaponMaster: {
                    name: 'Weapon collector',
                    description: 'blah',
                    price: 10e8,
                    requires: ['chainShaw', 'shotgun', 'rocket', 'plasma', 'bfg']
                },
                biggerBullets: {
                    name: 'Bigger bullets',
                    description: 'Increase shooting frags by 100%',
                    price: 10e9,
                    requires: ['upgrades'],
                    reqs: function (d) {
                        // return sum of 'bullet' tagged monsters
                        return (d.Monsters.data('owned.zomb') || 0 +
                            d.Monsters.data('owned.sarg') || 0 +
                            d.monsters.data('owned.cmmd') || 0) > 100;
                    }
                },
                biggerRockets: {
                    name: 'Bigger rockets',
                    description: 'Increase shooting frags by 1000%',
                    price: 10e18,
                    requires: ['upgrades'],
                    reqs: function (d) {
                        return (d.Monsters.data('owned.imp') || 0) > 1000;
                    }
                },
                clickAround: {
                    name: 'Let me click',
                    description: 'Increase click hits by 100%',
                    price: 1,
                    requires: ['upgrades'],
                    req: function (d) {
                        return d.Meta.data('usefulClicks') > 10;
                    }
                },
                clickMare: {
                    name: 'Clickmare',
                    description: 'Each hit on the marine will count as 100 hits',
                    price: 1,
                    req: {
                        upgrades: ['upgrades', 'clickMePlenty'],
                        fn: function (d) {

                        }
                    },
                    // watcher to register with ticker
                    watcher: function (d, tick) {
                        // register usefulclicks / clicks for an hour
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
        $rootScope, $timeout, UtilData, UpgradesDef, UpgradesData, Upgrades, Monsters, Player
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
                angular.forEach(UpgradesDef.upgrades, function(value, key) {
                    if (othis.owned(key) || othis.available(key));
                    else if (!othis.ownedAll(value.requires));
                    else if (angular.isFunction(value.reqFn)) {
                        var d = {
                            Upgrades: Upgrades,
                            Monsters: Monsters
                        }
                    }
                    else {
                        UpgradesData.available.push(key);
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
        UpgradesLogic.refresh();
    })
    .controller('UpgradesController', function($scope, $rootScope, Util, UtilBoot, UpgradesData, UpgradesLogic, Player) {

        var refreshAllPrice = function() {
            var allPrice = 0;
            angular.forEach(UpgradesData.available, function(upgradeId) {
                allPrice+= UpgradesLogic.nextPrice(upgradeId);
            });
            $scope.allPrice = allPrice;
        },
        usefulBuy = function() {
            $rootScope.$emit('Meta.usefulClick');
            refreshAllPrice();
        };

        angular.extend($scope, UtilBoot.activeTabMixin(), {
            activeTab: 'available',
            allPrice: 0,
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
            },
            canBuyAll: function() {
                return this.allPrice && Player.canBuy(this.allPrice);
            },
            buyAll: function() {
                UpgradesLogic.buyAll(usefulBuy);
            }
        });

        refreshAllPrice();

    })
;
