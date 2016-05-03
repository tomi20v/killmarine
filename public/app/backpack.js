angular.module('Backpack', ['Behaves'])
    .constant('BackpackDef', {
        module: 'Backpack',
        behaves: {
            Ownable: true,
            Spendable: true,
            Tops: true,
            Persisted: true
        },
        defs: {
            //frag: {
            //    name: 'Frags',
            //    description: 'You get frags by killing things'
            //}
            backpack: {
                name: 'Backpack',
                description: 'Holds ammo used by the monsters'
            }
        }
    })
    .service('Backpack', [
        'Behaves',
        'BackpackDef',
        function(Behaves, BackpackDef) {

            return Behaves.build(BackpackDef, 'Service');

    }])
    .service('BackpackBuilder', [
        'Behaves',
        'BackpackDef',
        function(Behaves, BackpackDef) {

            return Behaves.build(BackpackDef, 'Builder');

        }
    ])
    .service('BackpackData', [
        'Behaves',
        'BackpackDef',
        function(Behaves, BackpackDef) {

            return Behaves.build(BackpackDef, 'Data');

        }
    ])
    .service('BackpackLogic', [
        'Behaves',
        'BackpackDef',
        function(Behaves, BackpackDef) {

            return Behaves.build(BackpackDef, 'Logic', {
                onMarineDie: function(event, eventData) {
                    // I might want to give a backpack when marine die
                },
                onTick: function(event, tick) {



                }
            });

        }
    ])
    .run([
        '$rootScope',
        'Behaves',
        'BackpackDef',
        'BackpackLogic',
        function($rootScope, Behaves, BackpackDef, BackpackLogic) {

            Behaves.run(BackpackDef);

            $rootScope.$on('Marine.die', angular.bind(BackpackLogic, BackpackLogic.onMarineDie));

        }
    ])
;
