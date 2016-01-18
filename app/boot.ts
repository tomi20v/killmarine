import {bootstrap}    from 'angular2/platform/browser'
import {AppComponent} from './app.component'
import {Dispatcher} from "./dispatcher";
import {GameData} from "./game";

bootstrap(AppComponent, [Dispatcher, GameData]);
