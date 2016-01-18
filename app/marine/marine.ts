import {Component, Inject} from 'angular2/core';
import {Dispatcher} from "../dispatcher";
import {GameData} from "../game";

class MarineData {
    health: number = 100;
    level: number = 10;
    dies: number = 0;
    nextLevelDies: number = 10;
    dieMultiplier: number = 1.23;
}

class MarineState {
    public state: string = "IDLE";
    public stateChanged: number;
    public nextStateChange: number;
    public nextState: string = 'IDLE';
    public nextStateCallback;
    private dispatcher: Dispatcher;

    constructor(dispatcher: Dispatcher) {
        this.dispatcher = dispatcher;
    };

    public checkChange() {
        if (this.nextStateChange && this.nextStateChange < new Date().getTime()) {
            this.state = this.nextState;
            this.stateChanged = this.nextStateChange;
            this.nextStateChange = null;
            if (this.nextStateCallback) {
                this.nextStateCallback(this);
            }
        }
    };
    public timeoutState(newState, timeout, callback) {
        var othis = this;
        this.nextState = this.state;
        this.state = newState;
        this.stateChanged = new Date().getTime();
        this.nextStateChange = this.stateChanged + timeout;
        this.nextStateCallback = callback;
        setTimeout(this.getCheckChangeCallback(), timeout);
        setTimeout(function() { othis.checkChange.apply(othis) }, timeout+500);
    };
    public dieHandler() {
        this.timeoutState('DIES', 1400, function(){
            this.dispatcher.emit('marine.spawn');
        });
    }
    private getCheckChangeCallback() {
        var othis = this;
        return function() { othis.checkChange.apply(othis) }
    }
}

@Component({
    selector: 'marine',
    templateUrl: 'app/marine/marine.tpl'
})

export class MarineComponent {
    private data: MarineData = new MarineData();
    private state: MarineState;
    private dispatcher: Dispatcher;
    private gameData: GameData;
    constructor(
        @Inject(Dispatcher) dispatcher: Dispatcher,
        @Inject(GameData) gameData: GameData
    ) {
        this.dispatcher = dispatcher;
        this.state = new MarineState(dispatcher);
        this.gameData = gameData;
        this.dispatcher.subscribeBound('marine.spawn', this, this.spawnHandler);
        this.dispatcher.subscribeBound('marine.die', this.state, this.state.dieHandler);
    }
    public clickHandler(eventData: any) {
        if (this.state.state != 'IDLE') {
            return;
        }
        var damage = 50;
        this.data.health-= damage;
        if (this.data.health <= 0) {
            this.dies();
        }
    }
    public spawnHandler(eventData: any) {
        this.data.health = 100;
    }
    private dies() {
        this.data.dies++;
        // @todo levelup here!
        this.dispatcher.emit('marine.die', {
            level: this.data.level
        });
    }
    /** shall return proper top offset based on current image size */
    private getMarineTop(currentWidth) {
        switch (this.state.state) {
            case 'DIES':
                return (-0.37*currentWidth) + "px";
            case 'IDLE':
            default:
                return '';
        }
    }
    private showHealthBar() {
        return this.state.state == 'IDLE';
    }
}
