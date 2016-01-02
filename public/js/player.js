angular.module('Player', ['Items', 'Util'])
    .controller('PlayerBackpack', function($scope, $rootScope, PlayerData) {

        angular.merge($scope, {
            items: function(what) {
                return PlayerData.data.backpack.items[what] || 0;
            },
            onMax: function(what) {
                return PlayerData.data.backpack.max[what] &&
                        PlayerData.data.backpack.items[what] == PlayerData.data.backpack.max[what];
            }
        });

    })
    .controller('PlayerScoreBoard', function($scope, $rootScope, UtilBoot, PlayerData) {

        angular.merge($scope, {
            data: PlayerData.data
        });

    })
    .service('PlayerData', function($rootScope, UtilBoot, ItemsBackpack) {

        var data = {
            frags: 0,
            backpack: ItemsBackpack.instance()
        },
        logic = {
            onMarineDie: function(event, eventData) {

                data.frags++;
                data._game.frags++;
                data._total.frags++;

                var backpack = ItemsBackpack.getRandom(eventData.level),
                    clippedBackpack = ItemsBackpack.add(data.backpack, backpack);
                ItemsBackpack.add(data._game.backpack, clippedBackpack);
                ItemsBackpack.add(data._total.backpack, clippedBackpack);

            }
        };

        UtilBoot.prepareData(data);

        data.backpack.max.clips = 200;
        data.backpack.max.shells = 50;

        $rootScope.$on('Marine.die', angular.bind(logic, logic.onMarineDie));

        return {
            data: data
        };

    })
;
