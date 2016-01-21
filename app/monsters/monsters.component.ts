import {Component,Inject} from 'angular2/core';
import {NgFor,NgIf} from 'angular2/common';
import {Monster,MonstersDef} from './monsters.def';
import {Dispatcher} from '../dispatcher';
import {GameData} from '../game';

export class BuyLogic {
    public nextPrice(monsterId: string, cnt: number) {

    }
    public maxPrice(monsterId: string, cnt: number) {

    }
    public mayBuyable(monsterId: string, cnt: number) {

    }
    public buy(monsterId: string, cnt: number) {

    }
    private _buy(monsterId: string, cnt: number, price: number) {

    }
}

interface BuyStrategyInterface {
    maxBuyable(monsterId: string, cnt: number);
    nextPrice(monsterId: string, cnt: number);
    canBuyNext(monsterId: string, cnt: number);
    buy(monsterId: string, cnt: number);
}
class BuyStrategyAbstract {
    private buyLogic: BuyLogic;
    constructor(buyLogic: BuyLogic) {
        this.buyLogic = buyLogic;
    }
}
class BuyStrategy extends BuyStrategyAbstract implements BuyStrategyInterface {
    public maxBuyable(monsterId: string, cnt: number) {

    }
    public nextPrice(monsterId: string, cnt: number) {

    }
    public canBuyNext(monsterId: string, cnt: number) {

    }
    public buy(monsterId: string, cnt: number) {

    }
}
class BuyMaxStrategy extends BuyStrategyAbstract implements BuyStrategyInterface {
    public maxBuyable(monsterId: string, cnt: number) {

    }
    public nextPrice(monsterId: string, cnt: number) {

    }
    public canBuyNext(monsterId: string, cnt: number) {

    }
    public buy(monsterId: string, cnt: number) {

    }
}

@Component({
    selector: 'monsters',
    templateUrl: 'app/monsters/asset/monsters.html',
    directives: [NgFor, NgIf]
})

export class MonstersComponent {

    private dispatcher: Dispatcher;
    private gameData: GameData;
    private buyLogic: BuyLogic;
    private buyStrategy: BuyStrategyInterface;
    private buyStrategies: BuyStrategyInterface[] = [];

    private monstersDef: MonstersDef;
    private availableMonsters: Array<string>;
    private buyAtOnce: number = 1;

    constructor(
        @Inject(Dispatcher) dispatcher: Dispatcher,
        @Inject(GameData) gameData: GameData,
        @Inject(BuyLogic) buyLogic: BuyLogic,
        @Inject(MonstersDef) monstersDef: MonstersDef
    ) {

        this.dispatcher = dispatcher;
        this.gameData = gameData;
        this.buyLogic = buyLogic;
        this.monstersDef = monstersDef;

        this.buyStrategies[0] = new BuyStrategy(this.buyLogic);
        this.buyStrategies[1] = new BuyMaxStrategy(this.buyLogic);
        this.buyStrategy = this.buyStrategies[0];

        //this.dispatcher.subscribeBound('marine.die', this, this.marineDieHandler);

        this.availableMonsters = MonstersDef.getDefaultAvailable();

    }
    private monster(monsterId: string) {
        return this.monstersDef.monsters.find(function(monster) {
            return monster.id == monsterId;
        });
    }
    private cycleBuyAtOnce() {
        switch (this.buyAtOnce) {
            case 100:
                this.buyAtOnce = 0;
                this.buyStrategy = this.buyStrategies[1];
                break;
            case 0:
                this.buyAtOnce = 1;
                this.buyStrategy = this.buyStrategies[0]
                break;
            default:
                this.buyAtOnce*= 10;
        }
    }
    private canBuyNext(monsterId: string): Boolean {
        return this.buyStrategy.canBuyNext(monsterId, this.buyAtOnce);
    }
    private buy(monsterId: string) {
        console.log('buy', monsterId); return;
        this.buyStrategy.buy(monsterId, this.buyAtOnce);
    }
    private maxBuyable(monsterId: string) {
        console.log('maxBuyAble' + monsterId);
        return this.buyStrategy.maxBuyable(monsterId, this.buyAtOnce);
    }
    private nextPrice(monsterId: string) {
        return this.buyStrategy.nextPrice(monsterId, this.buyAtOnce);
    }

    private owned(monsterId: string): number {
        return this.gameData.game.monsters[monsterId];
    }

}
