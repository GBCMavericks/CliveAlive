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
        pads: [{x: 300, y: 470}, {x: 1100, y: 470}, 
               {x: 500, y: 320}, {x: 900,  y: 320}, 
               {x: 300, y: 170}, {x: 1100, y: 170}]
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
        pads: [{x: 300, y: 450}, {x: 1100, y: 450}, 
            {x: 500, y: 300}, {x: 900,  y: 300}, 
            {x: 300, y: 150}, {x: 1100, y: 150}]
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
        pads: [{x: 300, y: 450}, {x: 1100, y: 450}, 
            {x: 500, y: 300}, {x: 900,  y: 300}, 
            {x: 300, y: 150}, {x: 1100, y: 150}]
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
        pads: [{x: 300, y: 450}, {x: 1100, y: 450}, 
            {x: 500, y: 300}, {x: 900,  y: 300}, 
            {x: 300, y: 150}, {x: 1100, y: 150}]
 }
];