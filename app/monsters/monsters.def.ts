import {Injectable} from 'angular2/core';
import MonsterRegistry from "./";

export class MonsterFps {
    hit: number = 0;
    shoot: number = 0;
}

export class Monster {
    name: string = '';
    id: string = null;
    q: number = 1.03;
    price: number = 0;
    fps: MonsterFps = new MonsterFps();
    ammo: string = '';
    aps: number = 0;
    available: boolean = false;
}

class MonsterFactory {
    public static build(
        name: string,
        id: string,
        price: number,
        q: number,
        fps: number[],
        ammo: string,
        aps: number
    ): Monster {
        var monster = new Monster();
        monster.name = name;
        monster.id = id;
        monster.price = price;
        monster.q = q;
        monster.fps = this.buildFps(fps[0], fps[1]);
        monster.ammo = ammo;
        monster.aps = aps;
        return monster;
    }
    public static buildFps(
        hit: number,
        shoot: number
    ): MonsterFps {
        var monsterFps = new MonsterFps();
        monsterFps.hit = hit;
        monsterFps.shoot = shoot;
        return monsterFps;
    }
}

@Injectable()
export class MonstersDef {

    public monsters: Array<Monster>;

    static ids: Array<string> = ['zomb', 'sarg', 'cmmd', 'imp'];

    constructor() {
        this.monsters = [
            MonsterFactory.build(
                'Zombieman', 'zomb',
                5, 1.03, [1, 2],
                'clip', 1
            ),
            MonsterFactory.build(
                'Sargeant', 'sarg',
                20, 1.04, [1, 4],
                'shell', 1
            ),
            MonsterFactory.build(
                'Commando', 'cmmd',
                70, 1.06, [0, 10],
                'clip', 5
            ),

            MonsterFactory.build(
                'Imp', 'imp',
                30, 1.08, [2, 10],
                'rocket', 1
            )
        ];
    }

    static getRegistry(): Object {
        var owned = {};
        this.ids.forEach(function(id) {
            owned[id] = 0;
        })
        return owned;
    }

    static getDefaultAvailable(): Array<string> {
        return ['zomb', 'imp'];
    }

}
