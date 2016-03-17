angular.module('Monsters')
    .service('Monsters', [
        'Behaves',
        'MonstersDef',
        function(Behaves, MonstersDef) {

            return Behaves.build(MonstersDef, 'Service')

        }
    ])
    .service('MonstersBuilder', [
        'Util',
        'Behaves',
        'MonstersDef',
        function(Util, Behaves, MonstersDef) {

            var builder = Behaves.build(MonstersDef, 'Builder');

            return Util.extendWithWrap(builder, {
                build: function(data) {
                    return angular.extend(data, {
                        frags: {
                            byMonstersAll: 0,
                            byMonstersHit: 0,
                            byMonstersShoot: 0,
                            byMonsters: {},
                            byMarineFrags: 0
                        }
                    })
                }
            });

            //var monsterBuilder = function(monster) {
            //    var buyable = monster.buyable;
            //    angular.extend(monster, {
            //        buyable: function() {
            //            return buyable;
            //        }
            //    });
            //
            //    return monster;
            //};
            //
            //return function(data) {
            //    angular.merge(data, {
            //        owned: {},
            //        ownedAll: 0,
            //        // these are cached values, no need to save unless plan changes
            //        defs: {},
            //        frags: {
            //            byMonstersAll: 0,
            //            byMonstersHit: 0,
            //            byMonstersShoot: 0,
            //            byMonsters: {},
            //            byMarineFrags: 0
            //        }
            //    });
            //    angular.forEach(MonstersDef.monsters, function(monster) {
            //        var monsterCpy = angular.extend({}, MonstersDef.monsterProto, monster);
            //        data.owned[monster.id] = 0;
            //        data.defs[monster.id] = monsterBuilder(monsterCpy);
            //        data.frags.byMonsters[monster.id] = 0;
            //    });
            //    return data;
            //}

        }
    ])
    .service('MonstersData', [
        'Behaves',
        'MonstersDef',
        function(Behaves, MonstersDef) {

            return Behaves.build(MonstersDef, 'Data');

        }
    ])
    .service('MonstersLogic',[
        'Util',
        'Behaves',
        'MonstersDef',
        function(Util, Behaves, MonstersDef) {

            var logic = Behaves.build(MonstersDef, 'Logic');
            logic = Util.extendWithWrap(logic, {
                //maxPrice: function(monsterId) {
                //    var cnt = this.maxBuyable(monsterId);
                //    return this.nextPrice(monsterId, cnt);
                //},
                //maxBuyable: function(monsterId) {
                //    var owned = MonstersData.owned[monsterId],
                //        price = MonstersData.defs[monsterId].buyable().price,
                //        q = MonstersData.defs[monsterId].buyable().q,
                //        ownedPrice = UtilMath.sumGeoSeq(price, q, owned);
                //    return UtilMath.seqNBySum(ownedPrice + Frags.data('owned.frags'), price, q) - owned;
                //    //return UtilMath.seqNBySum(ownedPrice + Player.data('frags'), price, q) - owned;
                //},
                onTick: function(event, tick) {
                    //angular.forEach(tick.monsters, function(monster, monsterId) {
                    //    MonstersData.topsAdd(
                    //        ['frags', 'byMonsters', monsterId],
                    //        monster.frags.total
                    //    );
                    //});
                    //MonstersData.topsAdd('frags.hit', tick.frags.hit);
                    //MonstersData.topsAdd('frags.shoot', tick.frags.shoot);
                    //MonstersData.topsAdd('frags.byMonstersAll', tick.frags.hit + tick.frags.shoot);
                }
            });
            return logic;

        }
    ])
    .run([
        'Behaves',
        'MonstersDef',
        function(Behaves, MonstersDef) {

            Behaves.run(MonstersDef);

        }
    ])
    .controller('MonstersController', [
        '$scope',
        '$rootScope',
        'Behaves',
        'MonstersDef',
        function($scope, $rootScope, Behaves, MonstersDef) {

            Behaves.build(MonstersDef, 'Controller', $scope);

            angular.extend($scope, {
                shooting: {
                    monsterCnt: {},
                    shootPcnt: {},
                    shootingClass: function(id) {
                        var pcnt = this.shootPcnt[id] || 0,
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
                    shootingWidth: function(id) {
                        return this.shootPcnt[id] || 0;
                    }
                }
            });

            $rootScope.$on('Ticker.tick', function(event, tick) {
                angular.forEach(tick.monsters, function(monster, monsterId) {
                    $scope.shooting.monsterCnt[monsterId] = monster.cnt;
                    $scope.shooting.shootPcnt[monsterId] = monster.cnt.total
                        ? monster.cnt.shooting / monster.cnt.total * 100
                        : 0;
                })
            });

        }
    ])
;
