var app = angular.module('App', [
    'ngSanitize',
    'btford.markdown',
    'Util',
    'Marine',
    'Player',
    'Upgrades',
    'Monsters',
    'CheatBar',
    'Saver'
]);

app
    .config(['$provide', function ($provide) {
        $provide.decorator('$rootScope', function ($delegate) {
            var _emit = $delegate.$emit;

            $delegate.$emit = function () {
                if (arguments[0] == 'tick') {
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
    .controller('AppController', function($scope, $rootScope, UtilConfig) {

        angular.merge($scope, {
            activeTab: 'scoreboard',
            tabActive: function(id) {
                return $scope.activeTab == id;
            },
            setTab: function(id) {
                $scope.activeTab = id;
            }
        });

    });
