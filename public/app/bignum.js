angular.module('BigNum', [])
    .constant('BigPrefixes', [
        '',   'k',   'M',   'B',   'T',  'Qa',  'Qi',  'Sx',  'Sp',  'Oc',  'No',
              'Dc',  'Ud',  'Dd',  'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod'
    ])
    .filter('BigPrint', function(BigPrefixes, UtilConfig) {

        function toP(val, p, k) {
            return (val / Math.pow(k, p))
                .toFixed(4)
                .substring(0, 5)
                .replace(/[.0]+$/, '');
        }
        function formatP(p) {
            return (p ? 'e' + p : '');
        }

        return function(val) {
            var ret = val,
                k = 1000,
                p;

            if (!val) {
                return val;
            }

            if (val == 10e9) {
                console.log('x');
            }

            p = Math.floor(Math.log(val) / Math.log(k));

            switch (UtilConfig.config.notation) {
                case 0:
                    if (p < BigPrefixes.length) {
                        ret = toP(val, p, k) + BigPrefixes[p];
                        break;
                    }
                case 1:
                    p = Math.floor(Math.log(val) / Math.log(10) /3 ) * 3;
                    ret = p > 3
                        ? toP(val, p, 10) + formatP(p)
                        : val;
                    break;
                case 2:
                default:
                    ret = toP(val, p, k) + formatP(p);
                    break;
            }
            return ret;
        }
    })
    .service('BigPrintOptions', function() {
        return {
            0: 'short',
            1: 'scientific',
            2: 'engineering'
        }
    })
;