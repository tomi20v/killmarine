import {Component} from 'angular2/core';
import {MarineComponent} from './marine/marine';
import {ScoreboardComponent} from './scoreboard/scoreboard.component';

interface ConfigInterface {
    running: boolean,
    notation: number
}

@Component({
    selector: 'app',
    templateUrl: 'app/app.tpl',
    directives: [
        MarineComponent,
        ScoreboardComponent
    ]
})

export class AppComponent {
    public title = "Kill teh Marine - the Doom idle game";
    public Config: ConfigInterface = {
        running: false,
        notation: 2
    };
    private tabsActive: string = 'scoreboard';
    constructor() {
        console.log('OK', this);

    }

}
