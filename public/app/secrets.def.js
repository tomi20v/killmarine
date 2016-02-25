angular.module('Secrets', ['Util','Saver','Player'])
    .constant('SecretsDef', {
        secretProto: {
            name: '',
            id: '',
            description: '',
            requires: null,
            require: {
                events: null,
                callback: null
            },
            success: null,
            maxLevel: 0
        },
        secrets: {
            monsterOverflow: {
                name: 'Monster overflow',
                id: 'monsterOverflow',
                description: 'Own max number of monsters and buy more',
                require: {
                    events: 'Monsters.*',
                    callback: function(d) {
                        return d.Monsters.data('ownedAll') > 255;
                    }
                },
                success: function($rootScope) {
                    $rootScope.$emit('Monsters.resetOwned');
                }
            }
        }
    })
;
