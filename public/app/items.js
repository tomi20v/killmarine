angular.module('Items', ['Util'])
    .service('ItemsDefs', function() {
        return {
            backpackItems: {
                clip: 0,
                shell: 0,
                rocket: 0,
                cell: 0
            }
        };
    })
    .service('ItemsBackpack', function(UtilMath, ItemsDefs) {

        var backpack = {
            items: ItemsDefs.backpackItems,
            max: ItemsDefs.backpackItems
        };

        return {
            instance: function() {
                return angular.copy(backpack);
            },
            add: function(to, what) {

                var clipped = angular.copy(what);
                clipped.clipped = false;

                angular.forEach(to.max, function(max, i) {
                    var maxClipped = max > 0
                        ? max - to.items[i]
                        : clipped.items[i];
                    if (clipped.items[i] > maxClipped) {
                        clipped.items[i] = maxClipped;
                        clipped.clipped = true;
                    }
                });

                angular.forEach(clipped.items||{}, function(val, i) {
                    to.items[i] = to.items[i] + val;
                });

                return clipped;

            },
            mul: function(what, mul) {
                var clipped = angular.copy(what);
                angular.forEach(what.items, function(cnt, i) {
                    var max = what.max[i];
                    what.items[i] = Math.min(what.items[i] * mul, max);
                });
            },
            getRandom: function(monsterBackpack, mul) {
                var backpack = this.instance();
                angular.forEach(monsterBackpack.items, function(cnt, itemId) {
                    backpack.items[itemId] += UtilMath.randomInt(
                        monsterBackpack.guaranteed || 0,
                        mul * cnt * Math.pow(1.1, monsterBackpack.level || 0)
                    );
                });
                return backpack;
            }
        }
    })
;
