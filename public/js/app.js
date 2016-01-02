var app = angular.module('App', ['ngMaterial', 'angular-underscore', 'Marine', 'Player', 'Items'/*, 'Big'*/]);

app.controller('AppController', function($mdSidenav, $scope) {

    var vm = this;

    vm.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };

    angular.merge($scope, {
    });

});
