angular.module('Upgrades')
    .service('Upgrades', [
        'Behaves',
        'UpgradesDef',
        function(Behaves, UpgradesDef) {

            return Behaves.build(UpgradesDef, 'Service');

        }
    ])
    .service('UpgradesBuilder', [
        'Behaves',
        'UpgradesDef',
        function(Behaves, UpgradesDef) {

            return Behaves.build(UpgradesDef, 'Builder');

        }
    ])
    .service('UpgradesData', [
        'Behaves',
        'UpgradesDef',
        function(Behaves, UpgradesDef) {

            return Behaves.build(UpgradesDef, 'Data');

        }
    ])
    .service('UpgradesLogic', [
        'Behaves',
        'UpgradesDef',
        function(Behaves, UpgradesDef) {

            return Behaves.build(UpgradesDef, 'Logic');

        }
    ])
    .run([
        '$rootScope',
        'Behaves',
        'UpgradesDef',
        'UpgradesLogic',
        function($rootScope, Behaves, UpgradesDef, UpgradesLogic) {

            Behaves.run(UpgradesDef);

            var refresh = angular.bind(UpgradesLogic, UpgradesLogic.refresh);
            $rootScope.$on('Monsters.bought', refresh);

        }
    ])
    .controller('UpgradesController', [
        '$scope',
        'Behaves',
        'UpgradesDef',
        function($scope, Behaves, UpgradesDef) {

            Behaves.build(UpgradesDef, 'Controller', $scope);
            Behaves.mixin(UpgradesDef, 'HasTabsController', $scope);
            angular.merge($scope, {
                hasTabs: {
                    tabs: [
                        'available',
                        'owned'
                    ],
                    activeTab: 'available'
                }
            });

        }
    ])
;
