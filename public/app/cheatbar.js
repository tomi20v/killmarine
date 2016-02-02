angular.module('CheatBar', ['Saver', 'Util', 'Ticker', 'Player'])
    .controller('CheatBarController', function(
        $scope, $rootScope, Saver, UtilConfig, Ticker, PlayerData
    ) {

        angular.extend($scope, {
            cheat: function() {
                PlayerData.frags *= 123;
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
            },
            restart: function() {
                $rootScope.$emit('Game.restart');
            }
        });

    })
;
