describe('BigPrintFilter...', function() {

    var BigPrint;

    beforeEach(module('BigNum', 'Util'));

    beforeEach(inject(function($filter) {
        BigPrint = $filter('BigPrint');
    }));

    describe('with scientific notation...', function() {

        beforeEach(inject(function(UtilConfig) {
            UtilConfig.config.notation = 1;
        }));

        it('should print numbers', function() {
            var data = [
                [1e3, '1000'],
                [1e4, '10000'],
                [1e5, '100000'],
                [1e6, '1e6'],
                [1e7, '10e6'],
                [1e8, '100e6'],
                [1e9, '1e9'],
                [1.234e3, '1234'],
                [1.2345e4, '12345'],
                [1.23456e5, '123456'],
                [1.23456e6, '1.234e6'],
                [1.23456e7, '12.34e6'],
                [1.23456e8, '123.4e6'],
                [1.2345e9, '1.234e9']
            ];

            angular.forEach(data, function(eachData) {
                expect(BigPrint(eachData[0])).toEqual(eachData[1]);
            });

        })

    })
})
;
