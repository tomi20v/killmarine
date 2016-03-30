angular.module('Scoreboard', [])
    .controller('ScoreboardController', [
        '$scope',
        'Player',
        'Monsters',
        'Upgrades',
        'Meta',
        'Frags',
        function(
            $scope, Player, Monsters, Upgrades, Meta, Frags
        ) {

            angular.merge($scope, {
                player: angular.bind(Player, Player.data),
                monsters: angular.bind(Monsters, Monsters.data),
                upgrades: angular.bind(Upgrades, Upgrades.data),
                meta: angular.bind(Meta, Meta.data),
                frags: angular.bind(Frags, Frags.data),
                pcnt: function(p, all) {
                    var pcnt = all == 0
                        ? 0
                        : p / all * 100;
                    return Math.round(pcnt, 2);
                },
                timeDiff: function(tstamp) {
                    return (new Date().getTime() - tstamp) / 1000;
                }
            });
            // could help later on perfomance if needed
            //Behaves.bindControllerListeners($scope, [
            //    ['Ticker.tick', $scope.onTick]
            //]);

        }
    ])
;
