var app = angular.module('App', [
    'ngSanitize',
    'btford.markdown',
    'BigNum',
    'Util',
    'Marine',
    'Player',
    'Frags',
    'Upgrades',
    'Secrets',
    'Monsters',
    'CheatBar',
    'Saver',
    'Scoreboard'
]);

app
    .config([
        '$provide',
        function ($provide) {
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
        }
    ])
    .controller('AppController', [
        '$scope',
        '$rootScope',
        'Behaves',
        'Frags',
        function($scope, $rootScope, Behaves, Frags) {

            Behaves.mixin(null, 'HasTabsController', $scope);
            angular.merge($scope, {
                hasTabs: {
                    activeTab: 'scoreboard',
                    activeTab: 'upgrades'
                },
                fps: 0,
                ticks: 0,
                getFrags: function() {
                    return Frags.data('owned.frag');
                }
            });

            $rootScope.$on('Ticker.tick', function(event, tick) {
                angular.extend($scope, {
                    fps: Math.round(tick.fps),
                    ticks: tick.tick.seq
                });
            })

        }
    ])
;
