angular.module('Monsters', ['Util','Saver','Player'])
    .constant('MonstersDef', {
        monsterProto: {
            name: '',
            id: '',
            buyable: {
                price: 0,
                q: 0
            },
            fps: {
                hit: 0,
                shoot: 0
            },
            backpack: {
                level: 1,
                items: {
                    clip: 0,
                    shell: 0,
                    rocket: 0,
                    cell: 0
                }
            },
            ammo: null,
            aps: 0,
            available: false,
            tags: []
        },
        monsters: {
            zomb: {
                name: 'Zombieman',
                id: 'zomb',
                buyable: {
                    price: 5,
                    q: 1.03
                },
                fps: {
                    hit: 1,
                    shoot: 2
                },
                backpack: {
                    level: 1,
                    guaranteed: 0.6,
                    items: {
                        clip: 2
                    }
                },
                ammo: 'clip',
                aps: 1,
                available: true,
                tags: ['all', 'zomb']
            },
            sarg: {
                name: 'Sargeant',
                id: 'sarg',
                buyable: {
                    price: 20,
                    q: 1.04
                },
                fps: {
                    hit: 1,
                    shoot: 4
                },
                backpack: {
                    level: 1,
                    guaranteed: 0.2,
                    items: {
                        shell: 0.5
                    }
                },
                ammo: 'shell',
                aps: 2,
                available: true,
                tags: ['all', 'sarg']
            },
            cmmd: {
                name: 'Commando',
                id: 'cmmd',
                buyable: {
                    price: 2400,
                    q: 1.06
                },
                fps: {
                    hit: 1,
                    shoot: 10
                },
                backpack: {
                    level: 1,
                    guaranteed: 0.5,
                    items: {
                        clip: 1,
                        shell: 1
                    }
                },
                ammo: 'clip',
                aps: 3,
                available: false,
                tags: ['all', 'cmmd']
            },

            imp: {
                name: 'Imp',
                id: 'imp',
                buyable: {
                    price: 90,
                    q: 1.08
                },
                fps: {
                    hit: 2,
                    shoot: 10
                },
                backpack: {
                    level: 1,
                    guaranteed: 0.8,
                    items: {
                        clip: 1,
                        shell: 1
                    }
                },
                ammo: 'rocket',
                aps: 1,
                available: true,
                tags: ['all', 'imp']
            },
            manc: {
                name: 'Mancubus',
                id: 'manc',
                buyable: {
                    price: 600,
                    q: 1
                },
                fps: {
                    hit: 24,
                    shoot: 64
                },
                backpack: {
                    level: 1,
                    items: {
                        clip: 1,
                        shell: 1
                    }
                },
                ammo: 'rocket',
                aps: 5,
                available: false,
                tags: ['all', 'manc']
            },
            rev: {
                name: 'Revenant',
                id: 'rev',
                buyable: {
                    price: 300,
                    q: 1
                },
                fps: {
                    hit: 10,
                    shoot: 80
                },
                backpack: {
                    level: 1,
                    items: {
                        clip: 1,
                        shell: 1
                    }
                },
                ammo: 'rocket',
                aps: 10,
                available: false,
                tags: ['all', 'rev']
            },

            caco: {
                name: 'Cacodemon',
                id: 'caco',
                buyable: {
                    price: 400,
                    q: 1.26
                },
                fps: {
                    hit: 10,
                    shoot: 40
                },
                backpack: {
                    level: 1,
                    items: {
                        clip: 1,
                        shell: 1
                    }
                },
                ammo: 'rocket',
                aps: 10,
                available: false,
                tags: ['all', 'caco', 'episode1']
            },
            hell: {
                name: 'Hell Knight',
                id: 'hell',
                buyable: {
                    price: 500,
                    q: 1
                },
                fps: {
                    hit: 10,
                    shoot: 64
                },
                backpack: {
                    level: 1,
                    items: {
                        clip: 1,
                        shell: 1
                    }
                },
                ammo: 'rocket',
                aps: 1,
                available: false,
                tags: ['all', 'hell', 'episode2']
            },
            baro: {
                name: 'Baron of hell',
                id: 'baro',
                buyable: {
                    price: 1000,
                    q: 1
                },
                fps: {
                    hit: 10,
                    shoot: 80
                },
                backpack: {
                    level: 1,
                    items: {
                        clip: 1,
                        shell: 1
                    }
                },
                ammo: 'rocket',
                aps: 10,
                available: false,
                tags: ['all', 'baro', 'episode3']
            },

            demn: {
                name: 'Demon',
                id: 'demn',
                buyable: {
                    price: 5000,
                    q: 1
                },
                fps: {
                    hit: 40,
                    shoot: null
                },
                backpack: {
                    level: 1,
                    guaranteed: 0.2,
                    items: {
                        clip: 1,
                        shell: 1,
                        rocket: 1,
                        cell: 1,
                        plasma: 1,
                        slug: 1
                    }
                },
                ammo: null,
                aps: null,
                available: false,
                tags: ['all', 'demn', 'episode1']
            },
            lost: {
                name: 'Lost Soul',
                id: 'lost',
                buyable: {
                    price: 100,
                    q: 1
                },
                fps: {
                    hit: 24,
                    shoot: null
                },
                backpack: {
                    level: 1,
                    items: {
                        clip: 1,
                        shell: 1
                    }
                },
                ammo: null,
                aps: null,
                available: false,
                tags: ['all', 'lost', 'episode2']
            },
            arch: {
                name: 'Arch-Vile',
                id: 'arch',
                buyable: {
                    price: 700,
                    q: 1
                },
                fps: {
                    hit: 20,
                    shoot: 70
                },
                backpack: {
                    level: 1,
                    items: {
                        clip: 1,
                        shell: 1
                    }
                },
                ammo: null,
                aps: null,
                available: false,
                tags: ['all', 'arch', 'episode3']
            },

            spdm: {
                name: 'Spiderdemon',
                id: 'spdm',
                buyable: {
                    price: 3000,
                    q: 1
                },
                fps: {
                    hit: 0,
                    shoot: 650
                },
                backpack: {
                    level: 1,
                    items: {
                        clip: 1,
                        shell: 1
                    }
                },
                ammo: 'plasma',
                aps: 40,
                available: false,
                tags: ['all', 'spdm', 'episode1']
            },
            artr: {
                name: 'Arachnotron',
                id: 'artr',
                buyable: {
                    price: 500,
                    q: 1
                },
                fps: {
                    hit: 5,
                    shoot: 40
                },
                backpack: {
                    level: 1,
                    items: {
                        clip: 1,
                        shell: 1
                    }
                },
                ammo: 'plasma',
                aps: 1,
                available: false,
                tags: ['all', 'artr', 'episode2']
            },
            cybd: {
                name: 'Cyberdemon',
                id: 'cybd',
                buyable: {
                    price: 4000,
                    q: 1
                },
                fps: {
                    hit: 0,
                    shoot: 800
                },
                backpack: {
                    level: 1,
                    items: {
                        clip: 1,
                        shell: 1
                    }
                },
                ammo: 'plasma',
                aps: 666,
                available: false,
                tags: ['all', 'cybd', 'episode3']
            },

            icon: {
                name: 'Icon of Sin',
                id: 'icon',
                buyable: {
                    price: 10000,
                    id: 1
                },
                fps: {
                    hit: 0,
                    shoot: 0
                },
                backpack: {
                    level: 1,
                    items: {
                        clip: 1,
                        shell: 1
                    }
                },
                ammo: null,
                aps: null,
                available: false,
                tags: ['all', 'icon', 'episode4']
            }
        },
        available: {
            always: ['zomb', 'sarg', 'imp']
        }
    })
;
