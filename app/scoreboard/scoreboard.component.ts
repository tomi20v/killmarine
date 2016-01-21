import {Component,Inject} from 'angular2/core';
import {Dispatcher} from "./../dispatcher";
import {GameData} from "./../game";

@Component({
    selector: 'scoreboard',
    templateUrl: 'app/scoreboard/asset/scoreboard.html'
})

export class ScoreboardComponent {
    private dispatcher: Dispatcher;
    private gameData: GameData;
    constructor(
        @Inject(Dispatcher) dispatcher: Dispatcher,
        @Inject(GameData) gameData: GameData
    ) {
        this.dispatcher = dispatcher;
        this.gameData = gameData;

        this.dispatcher.subscribeBound('marine.die', this, this.marineDieHandler);
    }
    protected marineDieHandler(eventData) {
        console.log('scoreboard die', eventData);
    }
    private clickHandler() {
        this.gameData.add('frags', 2);
    }
}
