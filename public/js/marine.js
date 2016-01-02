angular.module('Marine', ['Util'])
    .service('Marine', function($rootScope) {

        var data = {
            health: 100,
            level: 10,
            dies: 0,
            nextLevelDies: 10,
            dieMultiplier: 1.2
        },
        logic = {
            onSpawn: function() {
                data.health = 100;
            },
            onHit: function() {
                var damage = 50;
                data.health -= damage;
                console.log('HIT for ' + damage);
                if (data.health <= 0) {
                    this.dies();
                }
            },
            dies: function() {
                data.dies++;
                if (data.dies >= data.nextLevelDies) {
                    this.levelUp();
                }
                $rootScope.$emit(
                    'Marine.die',
                    {
                        level: data.level
                    }
                );
            },
            levelUp: function() {
                console.log('@TODO: levelUp');
            }
        },
        service = {
            data: function(what) {
                return data[what];
            }
        };

        $rootScope.$on('Marine.spawn', angular.bind(logic, logic.onSpawn));
        $rootScope.$on('Marine.hit', angular.bind(logic, logic.onHit));

        return service;

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
            hit: function() {
                if (state.state != 'IDLE') {
                    return;
                }
                $rootScope.$emit('Marine.hit');
            }
        });

        UtilBoot
            .bindListeners($scope, [
                ['Marine.die', state.onDie]
            ]);

    });
