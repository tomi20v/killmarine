import {Component,Inject} from 'angular2/core';
import {Dispatcher} from "./dispatcher";

@Component({
    selector: 'scoreboard',
    template: `scoreboard here`
})

export class ScoreboardComponent {
    private dispatcher: Dispatcher;
    constructor(
        @Inject(Dispatcher) dispatcher: Dispatcher
    ) {
        this.dispatcher = dispatcher;
        this.dispatcher.subscribeBound('marine.die', this, this.marineDieHandler);
    }
    protected marineDieHandler(eventData) {
        console.log('d', eventData);
    }
}
