angular.module('Upgrades')
    .service('Upgrades', [
        'Behaves',
        'UpgradesDef',
        function(Behaves, UpgradesDef) {

            return Behaves.build(UpgradesDef, 'Service');

        }
    ])
    .service('UpgradesBuilder', [
        'Behaves',
        'UpgradesDef',
        function(Behaves, UpgradesDef) {

            return Behaves.build(UpgradesDef, 'Builder');

        }
    ])
    .service('UpgradesData', [
        'Behaves',
        'UpgradesDef',
        function(Behaves, UpgradesDef) {

            var data = Behaves.build(UpgradesDef, 'Data');
            console.log('data', data);
            return data;

        }
    ])
    .service('UpgradesLogic', [
        'Behaves',
        'UpgradesDef',
        function(
            Behaves, UpgradesDef
        ) {

            var logic = Behaves.build(UpgradesDef, 'Logic');
            console.log('logic', logic);
            return logic;

        }
    ])
    .run([
        '$rootScope',
        'UpgradesLogic',
        function($rootScope, UpgradesLogic) {
            var refresh = angular.bind(UpgradesLogic, UpgradesLogic.refresh);
            $rootScope.$on('Ticker.tick', refresh);
            $rootScope.$on('Monsters.bought', refresh);
            $rootScope.$on('Game.restart', angular.bind(UpgradesLogic, UpgradesLogic.onGameRestart));
        }
    ])
    .controller('UpgradesController', [
        '$scope',
        '$rootScope',
        'Util',
        'UtilBoot',
        'UpgradesData',
        'UpgradesLogic',
        function(
            $scope, $rootScope,
            Util, UtilBoot,
            UpgradesData, UpgradesLogic
        ) {

            var usefulBuy = function() {
                $rootScope.$emit('Meta.usefulClick');
            };

            function replaceInfo(id, cnt, info) {
                var label = UpgradesData.defs[id].label,
                    owned = UpgradesData.owned[id];
                return info.replace('{{label}}', label(owned + cnt));
            }

            angular.extend($scope, UtilBoot.activeTabMixin(), {
                activeTab: 'available',
                items: {
                    available: function () {
                        return Object.keys(UpgradesData.available);
                    },
                    owned: function () {
                        var ids = [];
                        angular.forEach(UpgradesData.owned, function (cnt, id) {
                            if (cnt) {
                                ids.push(id);
                            }
                        });
                        return ids;
                    },
                    allCnt: function () {
                        var cnt = 0;
                        angular.forEach(UpgradesData.owned, function (cnt, id) {
                            cnt += (cnt || 0);
                        });
                        return cnt;
                    },
                    data: function(id) {
                        return UpgradesData.defs[id] || {};
                    },
                    name: function(id, cnt) {
                        return replaceInfo(id, cnt, UpgradesData.defs[id].name);
                    },
                    description: function(id, cnt) {
                        return replaceInfo(id, cnt, UpgradesData.defs[id].description);
                    }
                },
                buyable: {
                    priceOfNext: angular.bind(UpgradesLogic, UpgradesLogic.priceOfNext),
                    priceOfAll: function() {
                        return 0;
                        //var allPrice = 0;
                        //angular.forEach(UpgradesData.available, function(upgradeId) {
                        //    allPrice+= UpgradesLogic.nextPrice(upgradeId);
                        //});
                        //return allPrice;
                    },
                    canBuy: angular.bind(UpgradesLogic, UpgradesLogic.canBuy),
                    canBuyAll: function() {
                        return false;
                        //var allPrice = this.allPrice();
                        //return allPrice && Player.canBuy(allPrice);
                    },
                    buy: function(upgradeId, cnt) {
                        UpgradesLogic.buy(upgradeId, cnt, usefulBuy);
                    },
                    buyAll: function() {
                        UpgradesLogic.buyAll(usefulBuy);
                    },
                    firstBuy: function(id) {
                        return UpgradesData.firstBuy[id] || null;
                    },
                    lastBuy: function(id) {
                        return UpgradesData.lastBuy[id] || null;
                    }
                }
            });

        }
    ])
;
