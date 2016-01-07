var app = angular.module('App', ['ngMaterial', 'angular-underscore', 'Marine', 'Player', 'Items', 'Monsters']);

app
    .config(['$provide', function ($provide) {
        $provide.decorator('$rootScope', function ($delegate) {
            var _emit = $delegate.$emit;

            $delegate.$emit = function () {
                console.log('EVENT: ', arguments);
                _emit.apply(this, arguments);
            };

            return $delegate;
        });
    }])
    .controller('AppController', function($mdSidenav, $scope) {

        var vm = this;

        vm.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };

        angular.merge($scope, {
        });

    });
