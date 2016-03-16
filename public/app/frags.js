angular.module('Frags', ['Behaves'])
    .constant('FragsDef', {
        module: 'Frags',
        behaves: {
            Ownable: true,
            Spendable: true,
            Tops: true,
            Persisted: true
        },
        defs: {
            frag: {
                name: 'Frags',
                description: 'You get frags by killing things'
            }
        }
    })
    .service('Frags', [
        'Behaves',
        'FragsDef',
        function(Behaves, FragsDef) {

            return Behaves.build(FragsDef, 'Service');

    }])
    .service('FragsBuilder', [
        'Behaves',
        'FragsDef',
        function(Behaves, FragsDef) {

            return Behaves.build(FragsDef, 'Builder');

        }
    ])
    .service('FragsData', [
        'Behaves',
        'FragsDef',
        function(Behaves, FragsDef) {

            return Behaves.build(FragsDef, 'Data');

        }
    ])
    .service('FragsLogic', [
        'Behaves',
        'FragsDef',
        'FragsData',
        function(Behaves, FragsDef, FragsData) {

            return Behaves.build(FragsDef, 'Logic', {
                onMarineDie: function(event, eventData) {

                    // @todo I should receive many frags depending on player level?
                    var frags = 1;

                    FragsData.topsAdd('owned.frag', frags);
                    FragsData.topsAdd('ownedAll', frags);

                }
            });

        }
    ])
    .run([
        '$rootScope',
        'FragsLogic',
        function($rootScope, FragsLogic) {
            $rootScope.$on('Marine.die', angular.bind(FragsLogic, FragsLogic.onMarineDie));
        }
    ])
;
