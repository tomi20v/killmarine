var app = angular.module('App', [
    'ngSanitize',
    'btford.markdown',
    'BigNum',
    'Util',
    'Marine',
    'Player',
    'Upgrades',
    'Monsters',
    'CheatBar',
    'Saver',
    'Scoreboard'
]);

app
    .config(['$provide', function ($provide) {
        $provide.decorator('$rootScope', function ($delegate) {
            var _emit = $delegate.$emit;

            $delegate.$emit = function () {
                if (arguments[0] == 'Ticker.tick') {
                    console.log('TIck');
                }
                else {
                    console.log('EVENT: ', arguments);
                }
                _emit.apply(this, arguments);
            };

            return $delegate;
        });
    }])
    .controller('AppController', function($scope, $rootScope, UtilBoot, UtilConfig, Player) {

        angular.extend($scope, UtilBoot.activeTabMixin(), {
            activeTab: 'scoreboard',
            //activeTab: 'upgrades',
            fps: 0,
            ticks: 0,
            getFrags: function() {
                return Player.data('frags');
            }
        });

        $rootScope.$on('Ticker.tick', function(event, tick) {
            angular.extend($scope, {
                fps: Math.round(tick.fps),
                ticks: tick.tick.seq
            });
        })

    });
