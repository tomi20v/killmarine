import {Component} from 'angular2/core';
import {MarineComponent} from './marine/marine';
import {ScoreboardComponent} from './scoreboard/scoreboard.component';
import {Backpack} from './items';
import {MonstersComponent} from "./monsters/monsters.component";

interface ConfigInterface {
    running: boolean,
    notation: number
}

@Component({
    selector: 'app',
    templateUrl: 'app/asset/app.html',
    directives: [
        MarineComponent,
        ScoreboardComponent,
        MonstersComponent
    ]
})

export class AppComponent {
    public title = "Kill teh Marine - the Doom idle game";
    public Config: ConfigInterface = {
        running: false,
        notation: 2
    };
    public tabsActive: string = 'scoreboard';
    constructor() {
        console.log('OK', this);

    }

    private tabActive(tab: string) {
        return this.tabsActive == tab;
    }
    private setTab(tab: string) {
        this.tabsActive = tab;
    }

}
