angular.module('CheatBar', ['Saver', 'Util', 'Ticker', 'Player'])
    .controller('CheatBarController', function(
        $scope, $rootScope, Saver, UtilConfig, Ticker, FragsData
    ) {

        angular.extend($scope, {
            cheat: function() {
                FragsData.owned.frag *= 123;
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
