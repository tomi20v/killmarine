angular.module('Upgrades', [])
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
                //shotgun: {
                //    name: 'Shotgun',
                //    description: 'Enable shotgun in the marine shootout. Also doubles Sargeant frags',
                //    price: 1e3,
                //    requires: ['upgrades1'],
                //    requireCallback: function (d) {
                //        return (
                //                d.Monsters.data('owned.sarge') || 0
                //            ) > 25;
                //    }
                //},
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
                    requireCallback: function (d) {
                        // return sum of 'bullet' tagged monsters
                        return (d.Monsters.data('owned.zomb') || 0 +
                            d.Monsters.data('owned.sarg') || 0 +
                            d.Monsters.data('owned.cmmd') || 0) > 100;
                    }
                },
                //rocket: {
                //    name: 'Rocket!',
                //    description: 'Enable rocket and rocket using monsters',
                //    price: 10e6,
                //    requires: ['upgrades1']
                //},
                biggerRockets: {
                    name: 'Bigger rockets',
                    description: 'Increase shooting frags by 1000%',
                    price: 10e18,
                    requires: ['upgrades1','rocket'],
                    requireCallback: function (d) {
                        return (d.Monsters.data('owned.imp') || 0) > 1000;
                    }
                },
                clickAround: {
                    name: 'Let me click',
                    description: 'Increase click hits by 100%',
                    price: 1,
                    requires: ['upgrades1'],
                    requireCallback: function (d) {
                        return d.Meta.data('usefulClicks') > 10;
                    }
                },
                clickMePlenty: {
                    name: 'Click me plenty!',
                    description: 'Increase FPS based on number of clicks in this game',
                    price: 1e9,
                    requires: ['clickAround'],
                    requireCallback: function (d) {

                    }
                },
                clickMare: {
                    name: 'Clickmare',
                    description: 'Each hit on the marine will count as 100 hits',
                    price: 1,
                    requires: ['upgrades1', 'clickMePlenty'],
                    requireCallback: function (d) {
                        // register usefulclicks / clicks for an hour and compare
                    }
                },
                bitMonsters: {
                    //name: '{{label}} bit monster count',
                    name: '16 bit monster count',
                    description: 'Own more than 255 monsters',
                    price: 16536,
                    requires: ['upgrades1'],
                    requireSecret: ['monsterOverflow'],
                    persists: true,
                    labels: [
                        null,
                        '16'
                    ]
                },

                episode1: {
                    name: 'Episode 1',
                    description: 'Unlock monsters, whatever.',
                    price: 1e3,
                    requires: ['upgrades1'],
                    // I need rootscope to emit
                    success: function($rootScope) {
                        $rootScope.$emit('Monsters.available', { tags: ['episode1']});
                    }
                },
                episode2: {
                    name: 'Episode 2',
                    description: 'Unlock monsters, whatever.',
                    price: 1e9,
                    requires: ['episode1'],
                    fn: function(emit) {
                        emit('Monsters.available', { tags: ['episode2']});
                    }
                },
                episode3: {
                    name: 'Episode 3',
                    description: 'Unlock monsters, whatever.',
                    price: 1e15,
                    requires: ['episode2'],
                    fn: function(emit) {
                        emit('Monsters.available', { tags: ['episode3']});
                    }
                },
                episode4: {
                    name: 'Episode 4',
                    description: 'Unlock monsters, whatever.',
                    price: 1e24,
                    requires: ['episode3'],
                    fn: function(emit) {
                        emit('Monsters.available', { tags: ['episode4']});
                    }
                }
            }
        }

    })
;
