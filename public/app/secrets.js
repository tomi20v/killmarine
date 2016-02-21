angular.module('Secrets')
    .service('Secrets', function(UtilData, SecretsData) {

        return UtilData.buildDataGetterService(SecretsData);

    })
    .service('SecretsBuilder', function(UtilData, SecretsDef) {

        return function(fields) {

            function secretBuilder(secret) {

                return angular.merge({}, SecretsDef.secretProto, secret, {
                    require: {
                        events: secret.require.events
                            ? '^' + secret.require.events.replace('.*', '\..*') + '$'
                            : null
                    }
                });

            }

            var data = angular.extend({}, {
                owned: {},
                ownedAll: 0,
                buyTimes: {},
                defs: {}
            });

            angular.forEach(SecretsDef.secrets, function(secret) {
                data.owned[secret.id] = 0;
                data.defs[secret.id] = secretBuilder(secret);
            });

            UtilData.buildDataTopSum(data, fields);

            return data;

        }

    })
    .service('SecretsData', function(
        SecretsBuilder, SecretsLoader
    ) {

        var fields = ['owned', 'ownedAll'],
            data = SecretsBuilder(fields);

        SecretsLoader(data, fields.concat('tops', 'buyTimes'));

        return data;

    })
    .service('SecretsLoader', function(Saver) {

        var saveKey = 'Secrets';

        return function(data, saveFields) {

            Saver.register(saveKey, data, saveFields);

            angular.merge(data, Saver.load(saveKey));

            data.ownedAll = 0;
            angular.forEach(data.owned, function (value, key) {
                data.ownedAll += value;
            })

        }

    })
    .service('SecretsLogic', function(
        $rootScope, Util, UtilData, UtilMath, SecretsDef, SecretsBuilder, SecretsData,
        Player, Monsters, Upgrades
    ) {

        var d = {
            Player: Player,
            Monsters: Monsters,
            Upgrades: Upgrades
        };

        function secretFound(secret) {

            var nextId = secret.id + (SecretsData.owned[secret.id] + 1);

            SecretsData.topsAdd(['owned', secret.id], 1);
            SecretsData.topsAdd('ownedAll', 1);
            SecretsData.buyTimes[nextId] = new Date().getTime();

            if (secret.success) {
                secret.success($rootScope);
            }

            $rootScope.$emit('Secrets.bought', {
                id: secret.id
            });

        }

        return {
            onGameRestart: function() {
                SecretsBuilder(SecretsData);
            },
            onEverything: function(event, eventData) {
                angular.forEach(SecretsData.defs, function(secret) {
                    if (secret.require.events &&
                        event.name.match(secret.require.events) &&
                        secret.require.callback(d)) {
                        secretFound(secret);
                    }
                })
            }
        };

    })
    .run(function($rootScope, $document, SecretsLogic) {
        var onEverything = angular.bind(SecretsLogic, SecretsLogic.onEverything);
        $rootScope.$on('Game.restart', onEverything);
        //$rootScope.$on('Secrets.available', angular.bind(SecretsLogic, SecretsLogic.onMonsterAvailable));
        //$rootScope.$on('Ticker.tick', angular.bind(SecretsLogic, SecretsLogic.onTick));
        $rootScope.$on('Monsters.bought', onEverything);
        $rootScope.$on('Upgrades.bought', onEverything);
        $rootScope.$on('Marine.hit', onEverything);
        $rootScope.$on('Marine.die', onEverything);
        $rootScope.$on('Meta.usefulClick', onEverything);
//        $document.on('click', onEverything);
    })
    .controller('SecretsController', function($scope, $rootScope, SecretsData) {

        angular.extend($scope, {
            getOwned: function() {
                var owned = [];
                angular.forEach(SecretsData.owned, function(cnt, id) {
                    if (cnt) {
                        owned.push(id);
                    }
                });
                return owned;
            },
            getById: function(secretId) {
                return SecretsData.defs[secretId] || {};
            }
        });

    })
;
