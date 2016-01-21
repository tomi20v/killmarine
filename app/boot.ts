import {bootstrap}    from 'angular2/platform/browser'
import {AppComponent} from './app.component'
import {Dispatcher} from "./dispatcher";
import {GameData} from "./game";
import {MonstersDef} from "./monsters/monsters.def";
import {BuyLogic} from "./monsters/monsters.component";

bootstrap(AppComponent, [Dispatcher, GameData, BuyLogic, MonstersDef]);
