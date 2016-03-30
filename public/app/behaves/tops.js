angular.module('BehavesTops', ['Util'])
    .service('BehavesTopsData', [
        'Util',
        function(Util) {

            return function(obj, def) {

                var cpy;

                obj.saveFields = obj.saveFields || [];
                cpy = Util.copyProps(obj, obj.saveFields);

                angular.extend(obj, {
                    tops: {
                        top: angular.copy(cpy),
                        total: angular.copy(cpy),
                        thisGameSum: angular.copy(cpy),
                        anyGameSum: cpy
                    }
                });

                obj.saveFields.push('tops');

                return obj;

            }

        }
    ])
    .service('BehavesTopsLogic', [
        '$injector',
        'Util',
        'UtilData',
        'BehavesTopsStrategies',
        function($injector, Util, UtilData, BehavesTopsStrategies) {

            return function(obj, def) {

                var DataService = $injector.get(def.module + 'Data'),
                    strategy = def.behaves.Tops.sum
                        ? BehavesTopsStrategies.topsAddSum
                        : BehavesTopsStrategies.topsAdd;

                return Util.extendWithWrap(obj, {
                    topsAdd: function(index, cnt) {
                        return strategy(DataService, index, cnt);
                    },
                    extendableGot: function(prevGot, id, cnt) {

                        this.topsAdd(['owned', id], cnt);
                        this.topsAdd('ownedAll', cnt);

                    }
                });

            }

        }
    ])
    // I've kept them separate and reachable to be testable
    .service('BehavesTopsStrategies', [
        'Util',
        function(Util) {

            return {
                topsAdd: function(data, index, value) {
                    value = value || 0;
                    var newVal = Util.lookUp(data, index),
                    // max in any game
                        newTop = Util.deepSetMax(data.tops.top, index, newVal),
                    // sum/gained this game
                        newSum = Util.deepAddMin(data.tops.thisGameSum, index, value, newVal),
                    // max gained in any game
                        newAnyGameSum = Util.deepSetMax(data.tops.anyGameSum, index, newSum),
                    // all gained total
                        newTotalSum = Util.deepAddMin(data.tops.total, index, value, 0);
                },
                topsAddSum: function(data, index, value) {
                    value = value || 0;
                    var newVal = Util.lookUp(data, index),
                        t = Util.deepSetMax(data.tops.top, index, newVal);
                    Util.deepAddMin(data.tops.total, index, value, t);
                }
            }

        }
    ])
;
