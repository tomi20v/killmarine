angular.module('Scoreboard', [])
    .controller('ScoreboardController', function(
        $scope, Util, Player, MonstersData, Meta
    ) {

        angular.merge($scope, {
            player: angular.bind(Player, Player.data),
            monsters: function(index) {
                return Util.lookUp(MonstersData, index);
            },
            meta: angular.bind(Meta, Meta.data),
            pcnt: function(p, all) {
                var pcnt = all == 0
                    ? 0
                    : p / all * 100;
                return Math.round(pcnt, 2);
            }
        });

    });
