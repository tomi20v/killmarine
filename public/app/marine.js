angular.module('Marine', ['Util'])
    .service('Marine', function($rootScope, UtilData, MarineData) {

        return UtilData.buildDataGetterService(MarineData);

    })
    .service('MarineData', function() {

        var data = {
            health: 100,
            level: 10,
            dies: 0,
            nextLevelDies: 10,
            dieMultiplier: 1.2
        };

        return data;

    })
    .service('MarineLogic', function($rootScope, MarineData) {

        return {
            onSpawn: function() {
                MarineData.health = 100;
            },
            onHit: function() {
                var damage = 50;
                MarineData.health -= damage;
                if (MarineData.health <= 0) {
                    this.dies();
                }
            },
            dies: function() {
                MarineData.dies++;
                if (MarineData.dies >= MarineData.nextLevelDies) {
                    this.levelUp();
                }
                $rootScope.$emit(
                    'Marine.die',
                    {
                        level: MarineData.level
                    }
                );
            },
            levelUp: function() {
                console.log('@TODO: levelUp');
            }
        };

    })
    .run(function($rootScope, MarineLogic) {
        $rootScope.$on('Marine.spawn', angular.bind(MarineLogic, MarineLogic.onSpawn));
        $rootScope.$on('Marine.hit', angular.bind(MarineLogic, MarineLogic.onHit));
    })
    .directive('marineTopOffset', function() {
        return {
            link: function(scope, el, attrs) {
                el.bind(
                    'load', function() {
                        var width = el[0].offsetWidth;
                        switch (el.attr('ng-class')) {
                            case 'doomguy-img-dies':
                                el.prop('style').top = width * -0.37 + 'px';
                                break;
                        }
                    }
                );
            }
        }
    })
    .controller('MarineController', function(
        $scope, $rootScope, $interval, $timeout,
        UtilBoot, Marine
    ) {

        var state = {
            state: 'IDLE',
            stateChanged: new Date().getTime(),
            nextStateChange: null,
            nextState: 'IDLE',
            nextStateCallback: null,
            checkChange: function() {
                if (this.nextStateChange && this.nextStateChange < new Date().getTime()) {
                    this.state = this.nextState;
                    this.stateChanged = this.nextStateChange;
                    this.nextStateChange = null;
                    if (this.nextStateCallback) {
                        this.nextStateCallback(this);
                    }
                }
            },
            timeoutState: function(newState, timeout, callback) {
                this.nextState = this.state;
                this.state = newState;
                this.stateChanged = new Date().getTime();
                this.nextStateChange = this.stateChanged + timeout;
                this.nextStateCallback = callback;
                $timeout(checkChange, timeout);
                $timeout(checkChange, timeout+500);
            },
            onDie: function() {
                state.timeoutState('DIES', 1400, function(){
                    $rootScope.$emit('Marine.spawn');
                });
            }
        };

        function checkChange() {
            state.checkChange();
        }

        angular.merge($scope, {
            getState: function() {
                state.checkChange();
                return state.state;
            },
            getHealth: function() {
                return Marine.data('health');
            },
            getLevel: function() {
                return Marine.data('level');
            },
            getMarineTop: function(currentWidth) {
                switch (state.state) {
                    case 'DIES':
                        return (-0.37*currentWidth) + "px";
                    case 'IDLE':
                    default:
                        return '';
                }
            },
            hit: function() {
                if (state.state != 'IDLE') {
                    return;
                }
                $rootScope.$emit('Meta.usefulClick');
                $rootScope.$emit('Marine.hit');
            }
        });

        UtilBoot
            .bindListeners($scope, [
                ['Marine.die', state.onDie]
            ]);

    });
