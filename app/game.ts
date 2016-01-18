import {Injectable, Inject} from 'angular2/core';
import {Backpack, BackpackLogic} from './items';
import {Tick} from './ticker';
import {Dispatcher} from "./dispatcher";

class Game {
    public frags: number = 0;
    public backpack: Backpack = new Backpack();
}
class GameMS {
    public top: Game = new Game();
    public sum: Game = new Game();
}
@Injectable()
export class GameData {

    private game: Game = new Game();
    private total: GameMS = new GameMS();
    private tops: GameMS = new GameMS();

    public tick: Tick;
    public lastTick: Tick;

    private dispatcher: Dispatcher;

    constructor(
        @Inject(Dispatcher) dispatcher: Dispatcher
    ) {
        this.dispatcher = dispatcher;
        this.dispatcher.subscribeBound('ticker.tick', this, this.tickHandler);
    }

    public add(to: string, what: any) {
        switch (to) {
            case 'frags':
                var newFrags = this.game.frags + what;
                this.game.frags = newFrags;
                this.total.top.frags = Math.max(this.total.top.frags, newFrags);
                this.total.sum.frags+= what;
                this.tops.top.frags = Math.max(this.tops.top.frags, newFrags);
                this.tops.sum.frags+= what;
                break;
            case 'backpack':
                //BackpackLogic.add(this.game.backpack, what);
                break;
        }
    }
    public tickHandler(tick: Tick) {
        console.log('tickHandler', Tick);
    }

}
