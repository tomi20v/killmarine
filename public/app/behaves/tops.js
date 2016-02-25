angular.module('BehavesTops', ['Util'])
    .service('BehavesTopsData', [
        'UtilData',
        'BehavesTopsStrategies',
        function(UtilData, BehavesTopsStrategies) {

            return function(obj, def) {

                var strategy = def.behaves.Tops.sum
                    ? BehavesTopsStrategies.buildTopSum
                    : BehavesTopsStrategies.buildTop;

                obj = strategy(obj, obj.saveFields);

                obj.saveFields = obj.saveFields || [];
                obj.saveFields.push('tops');

                return obj;

            }

        }
    ])
    .service('BehavesTopsStrategies', [
        'Util',
        function(Util) {

            return {
                buildTopSum: function(data, whitelist) {
                    var cpy = Util.copyProps(data, whitelist);
                    angular.extend(data, {
                        tops: {
                            top: angular.copy(cpy),
                            total: angular.copy(cpy),
                            thisGameSum: angular.copy(cpy),
                            anyGameSum: cpy
                        },
                        topsAdd: function(index, value) {
                            value = value || 0;
                            var newVal = Util.deepAddMin(this, index, value, 0),
                            // max in any game
                                newTop = Util.deepSetMax(this.tops.top, index, newVal),
                            // sum/gained this game
                                newSum = Util.deepAddMin(this.tops.thisGameSum, index, value, newVal),
                            // max gained in any game
                                newAnyGameSum = Util.deepSetMax(this.tops.anyGameSum, index, newSum),
                            // all gained total
                            //newTotalSum = Util.deepAddMin(this.tops.total, index, value, newAnyGameSum);
                                newTotalSum = Util.deepAddMin(this.tops.total, index, value, 0);
                        }
                    });
                    return data;
                },
                buildTop: function(data, whitelist) {
                    var cpy = Util.copyProps(data, whitelist);
                    angular.extend(data, {
                        tops: {
                            top: angular.copy(cpy),
                            total: angular.copy(cpy),
                            thisGameSum: angular.copy(cpy),
                            anyGameSum: cpy
                        },
                        topsAdd: function(index, value) {
                            value = value || 0;
                            var newVal = Util.deepAdd(this, index, value),
                                t = Util.deepSetMax(this.tops.top, index, newVal);
                            Util.deepAddMin(this.tops.total, index, value, t);
                            return newVal;
                        }
                    });
                    return data;
                }
            }

        }
    ])
;
