angular.module('BigNum', [])
    .constant('BigPrefixes', [
        '',   'k',   'M',   'B',   'T',  'Qa',  'Qi',  'Sx',  'Sp',  'Oc',  'No',
              'Dc',  'Ud',  'Dd',  'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod'
    ])
    .filter('BigPrint', function(BigPrefixes) {
        return function(val) {
            return val;
        }
    })
;
