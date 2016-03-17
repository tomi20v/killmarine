angular.module('Monsters', ['Util','Saver','Player'])
    .constant('MonstersDef', {
        module: 'Monsters',
        behaves: {
            Item: {
                proto: {
                    price: {
                        base: 0,
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
                    aps: 0
                }
            },
            Ownable: true,
            Available: true,
            Buyable: {
                resource: {
                    module: 'Frags',
                    id: 'frag'
                }
            },
            Tops: {
                sum: true
            },
            Persisted: true
        },
        defs: {
            zomb: {
                name: 'Zombieman',
                id: 'zomb',
                price: {
                    base: 5,
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
                aps: 1
            },
            sarg: {
                name: 'Sargeant',
                id: 'sarg',
                price: {
                    base: 20,
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
                requires: {
                    Upgrades: ['owned.upgrades.1']
                }
            },
            cmmd: {
                name: 'Commando',
                id: 'cmmd',
                price: {
                    base: 2400,
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
                requires: {
                    Upgrades: ['owned.upgrades.3']
                }
            },

            imp: {
                name: 'Imp',
                id: 'imp',
                price: {
                    base: 90,
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
                requires: {
                    Upgrades: ['owned.upgrades.1']
                }
            },
            manc: {
                name: 'Mancubus',
                id: 'manc',
                price: {
                    base: 600,
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
                requires: {
                    Upgrades: ['owned.upgrades.2']
                }
            },
            rev: {
                name: 'Revenant',
                id: 'rev',
                price: {
                    base: 300,
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
                requires: {
                    Upgrades: ['owned.upgrades.3']
                }
            },

            caco: {
                name: 'Cacodemon',
                id: 'caco',
                price: {
                    base: 400,
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
                requires: {
                    Upgrades: ['owned.upgrades.2']
                }
            },
            hell: {
                name: 'Hell Knight',
                id: 'hell',
                price: {
                    base: 500,
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
                requires: {
                    Upgrades: ['owned.upgrades.3']
                }
            },
            baro: {
                name: 'Baron of hell',
                id: 'baro',
                price: {
                    base: 1000,
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
                requires: {
                    Upgrades: ['owned.upgrades.4']
                }
            },

            demn: {
                name: 'Demon',
                id: 'demn',
                price: {
                    base: 5000,
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
                requires: {
                    Upgrades: ['owned.upgrades.1']
                }
            },
            lost: {
                name: 'Lost Soul',
                id: 'lost',
                price: {
                    base: 100,
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
                requires: {
                    Upgrades: ['owned.upgrades.3']
                }
            },
            arch: {
                name: 'Arch-Vile',
                id: 'arch',
                price: {
                    base: 700,
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
                requires: {
                    Upgrades: ['owned.upgrades.5']
                }
            },

            spdm: {
                name: 'Spiderdemon',
                id: 'spdm',
                price: {
                    base: 3000,
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
                requires: {
                    Upgrades: ['owned.upgrades.4']
                }
            },
            artr: {
                name: 'Arachnotron',
                id: 'artr',
                price: {
                    base: 500,
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
                requires: {
                    Upgrades: ['owned.upgrades.5']
                }
            },
            cybd: {
                name: 'Cyberdemon',
                id: 'cybd',
                price: {
                    base: 4000,
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
                requires: {
                    Upgrades: ['owned.upgrades.6']
                }
            },

            icon: {
                name: 'Icon of Sin',
                id: 'icon',
                price: {
                    base: 10000,
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
                requires: {
                    Upgrades: ['owned.upgrades.7']
                }
            }
        }
    })
;
