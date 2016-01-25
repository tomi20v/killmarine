angular.module('CheatBar', ['Saver', 'Util', 'Ticker', 'Player'])
    .controller('CheatBarController', function(
        $scope, $rootScope, Saver, UtilConfig, Ticker, PlayerData
    ) {

        angular.extend($scope, {
            cheat: function() {
                PlayerData.frags *= 123;
            },
            burn: function() {
                $rootScope.$emit('Monsters.registerMod', {
                    filter: function(monster) {
                        return true;
                    },
                    path: 'price',
                    fn: function(oldFn) {
                        return 0.1 * oldFn();
                    },
                    timeout: 2000
                });
            },
            tick: function() {
                Ticker();
            },
            paused: function() {
                return UtilConfig.paused;
            },
            pause: function() {
                $rootScope.$emit('Game.pause');
            },
            resume: function() {
                $rootScope.$emit('Game.resume');
            },
            save: function() {
                Saver.save();
            }
        });

    })
;
