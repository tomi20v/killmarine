angular.module('Upgrades')
    .service('Upgrades', function(UtilData, UpgradesData) {

        return UtilData.buildDataGetterService(UpgradesData);

    })
    .service('UpgradesData', function(
        UtilData, UpgradesLoader, UpgradesDef
    ) {

        var data = {
            owned: [],
            ownedAll: 0,
            buyTimes: {},
            available: [],
            defs: {}
        };

        angular.forEach(UpgradesDef, function(value, key) {
            data.owned[key] = 0;
        });

        UtilData.buildDataTop(data);

        UpgradesLoader(data);

        angular.extend(data, {
            defs: angular.copy(UpgradesDef.upgrades)
        });

        return data;

    })
    .service('UpgradesLoader', function(Util, Saver) {

        var saveKey = 'Upgrades';

        return function(data) {

            Saver.register(saveKey, data, ['owned', 'ownedAll', 'buyTimes', 'tops']);

            angular.merge(data, Saver.load(saveKey));

        }

    })
    .service('UpgradesLogic', function(
        $rootScope, $timeout, UtilData, UtilTime, UpgradesDef, UpgradesData, Upgrades, Monsters, Player, Meta
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
                    else if (!allSecrets(value.reqSecrets));
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
                return UpgradesData.defs[upgradeId].price;
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
        allSecrets = function(secrets) {
            // @todo implement with secrets
            return true;
        },
        buy = function(upgradeId, succesCallback) {

            if (service.owned(upgradeId) || !service.available(upgradeId)) {
                return;
            }

            var price = UpgradesData.defs[upgradeId].price;

            // I'm not sure why but I have to timeout this $emit otherwise angular.forEach()
            //      breaks in caller method (WTF)
            $timeout(function() {
                $rootScope.$emit('Player.spend', {
                    frags: price,
                    callback: function () {

                        UpgradesData.owned.push(upgradeId);
                        UpgradesData.topsAdd('ownedAll', 1);
                        UpgradesData.available.splice(UpgradesData.available.indexOf(upgradeId), 1);
                        UpgradesData.buyTimes[upgradeId] = UtilTime.playTime();

                        if (angular.isFunction(UpgradesData.defs[upgradeId].success)) {
                            UpgradesData.defs[upgradeId].success($rootScope);
                        }

                        succesCallback();

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
        var refresh = angular.bind(UpgradesLogic, UpgradesLogic.refresh);
        $rootScope.$on('Ticker.tick', refresh);
        $rootScope.$on('Monsters.bought', refresh);
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
                return UpgradesData.defs[upgradeId] || {};
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
