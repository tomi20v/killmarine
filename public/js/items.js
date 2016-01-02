angular.module('Items', ['Util'])
    .service('ItemsBackpack', function(UtilMath) {

        var logic = {
        },
        backpack = {
            items: {
                clips: 0,
                shells: 0
            },
            max: {
                clips: 0,
                shells: 0
            }
        };

        return {
            instance: function() {
                return angular.copy(backpack);
            },
            add: function(to, what) {

                var clipped = angular.copy(what);

                angular.forEach(to.max, function(max, i) {
                    var maxClipped = max - to.items[i];
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
            getRandom: function(level) {
                var backpack = this.instance();
                backpack.items.clips = UtilMath.randomInt(10, 10*level);
                backpack.items.shells = UtilMath.randomInt(2, 2*level);
                return backpack;
            }
        }
    })
;
