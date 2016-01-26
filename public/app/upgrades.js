angular.module('Upgrades', [])
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
                    description: '',
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
                // proto for a multilevel upgrade
                //clickMePlenty: {
                //    name: 'Click me plenty',
                //    description: 'Increase click hits by 200%',
                //    price: 1,
                //    maxLevel: 3,
                //    req: {
                //        upgrades: ['upgrades'],
                //        fn: function(d, level) {
                //            var hash = 'clickMePlenty' + level;
                //            return d.Hashes.data('owned').indexOf(hash) != -1;
                //        }
                //    }
                //},
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
            available: [],
            defs: {}
        };

        angular.forEach(UpgradesDef, function(value, key) {
            data.owned[key] = 0;
        });

        UtilData.buildDataTotal(data);

        UpgradesLoader(data);

        angular.merge(data, {
            available: ['upgrades'],
            defs: {
                upgrades: angular.copy(UpgradesDef.upgrades)
            }
        });

        return data;

    })
    .service('UpgradesLoader', function(Saver) {

        var saveKey = 'Upgrades';

        return function(data) {

            Saver.register(saveKey, data);

            angular.extend(data, Saver.load(saveKey));

        }

    })
    .service('UpgradesLogic', function(
        UtilData, UpgradesDef, UpgradesData, Upgrades, Monsters
    ) {

        return {
            available: function(upgradeId) {
                return (UpgradesData.owned.indexOf(upgradeId) != -1) ||
                        (UpgradesData.available.indexOf(upgradeId) != -1);
            },
            owned: function(upgradeId) {
                return UpgradesData.owned.indexOf(upgradeId) != -1;
            },
            available: function(upgradeId) {
                return UpgradesData.available.indexOf(upgradeId) != -1;
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
                var watches = [];
                console.log('refresh here');
                // copy available upgrades to defs
                angular.forEach(UpgradesDef.upgrades, function(value, key) {
                    if (this.owned(key) || this.available(key));
                    else if (!this.ownedAll(value.requires));
                    else if (angular.isFunction(value.reqFn)) {
                        var d = {
                            Upgrades: Upgrades,
                            Monsters: Monsters,
                        }
                    }
                    else {
                        this.available.push(key);
                    }
                });
            }
        }

    })
    .run(function($rootScope, UpgradesLogic) {

    })
    .controller('UpgradesController', function($scope, Util, UpgradesData) {

        angular.extend($scope, {
            availableUpgrades: function() {
                return UpgradesData.available;
            },
            upgrade: function(upgradeId) {
                return UpgradesData.defs[upgradeId] || {};
            },
            nextPrice: function(upgradeId) {
                return 42;
            }
        });

    })
;
