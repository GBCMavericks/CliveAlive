const NEVER = -1;

const LEVELS = [
    {
        intervals: {
            crate: 20000,
            zombie: 3000,
            flyingZombie: 3000,
            flyingZombieFire: 2500,
            jumperZombie: 3000

        },
        spawnCounts: {
            zombies: 4,
            flyingZombies: 0,
            jumperZombies: 0
        },
        pads: [{x: 300, y: 600}, {x: 1100, y: 600}, 
               {x: 500, y: 450}, {x: 900,  y: 450}, 
               {x: 300, y: 300}, {x: 1100, y: 300}]
    },
    {
        intervals: {
            crate: 20000,
            zombie: 3000,
            flyingZombie: 3000,
            flyingZombieFire: 2500,
            jumperZombie: 3000

        },
        spawnCounts: {
            zombies: 4,
            flyingZombies: 0,
            jumperZombies: 4
        },
        pads: [{x: 300, y: 600}, {x: 1100, y: 600}, {x: 500, y: 450}, {x: 900, y: 450}, {x: 300, y: 300}, {x: 1100, y: 300}]
    },
    {
        intervals: {
            crate: 20000,
            zombie: 3000,
            flyingZombie: 3000,
            flyingZombieFire: 2500,
            jumperZombie: 3000

        },
        spawnCounts: {
            zombies: 5,
            flyingZombies: 5,
            jumperZombies: 5
        },
        pads: [{x: 300, y: 600}, {x: 1100, y: 600}, {x: 500, y: 450}, {x: 900, y: 450}, {x: 300, y: 300}, {x: 1100, y: 300}]
    },
    {
        intervals: {
            crate: 20000,
            zombie: 3000,
            flyingZombie: 3000,
            flyingZombieFire: 2500,
            jumperZombie: 3000

        },
        spawnCounts: {
            zombies: 10,
            flyingZombies: 10,
            jumperZombies: 10
        },
        pads: [{x: 300, y: 600}, {x: 1100, y: 600}, {x: 500, y: 450}, {x: 900, y: 450}, {x: 300, y: 300}, {x: 1100, y: 300}]
    }
];