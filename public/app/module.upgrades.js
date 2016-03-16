var UpgradesModule = angular.module('Upgrades', ['Builder']);

UpgradesModule
    .constant('UpgradesDef', {
        // ...
        items: {
            // ...
        }
    })
    .run(['BuilderModule', 'UpgradesDef', 'Player', function(
            BuilderModule, UpgradesDef, Player
        ) {

            BuilderModule
                .isOwnable()
                .isBuyable(Player)

                .buildService()


                .buildData()
                .buildLoader()
                .buildLogic()

                .buildController()
            ;

    }])
    .run(function($rootScope, UpgradesLogic) {
        var refresh = angular.bind(UpgradesLogic, UpgradesLogic.refresh);
        $rootScope.$on('Ticker.tick', refresh);
        $rootScope.$on('Monsters.bought', refresh);
        $rootScope.$on('Game.restart', angular.bind(UpgradesLogic, UpgradesLogic.onGameRestart));
    })
;
