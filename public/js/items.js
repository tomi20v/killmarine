angular.module('Items', ['Util'])
    .service('ItemsBackpack', function(UtilMath) {

        var logic = {
        },
        backpack = {
            items: {
                clip: 0,
                shell: 0,
                rocket: 0,
                plasma: 0
            },
            max: {
                clip: 0,
                shell: 0,
                rocket: 0,
                plasma: 0
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
                backpack.items.clip = UtilMath.randomInt(10, 10*level);
                backpack.items.shell = UtilMath.randomInt(2, 2*level);
                return backpack;
            }
        }
    })
;