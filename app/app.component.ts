import {Component} from 'angular2/core';
import {MarineComponent} from './marine/marine';
import {ScoreboardComponent} from './scoreboard.component';

interface ConfigInterface {
    running: boolean,
    notation: number
}

@Component({
    selector: 'app',
    template: `
    <h1>fckitol</h1>
    <marine #asd id="asdid"></marine>
    <scoreboard #bsd id="bsdid"></scoreboard>
    `,
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
    constructor() {
        console.log('OK', this);

    }
}
