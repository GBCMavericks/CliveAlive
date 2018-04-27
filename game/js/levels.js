const NEVER = -1;

const LEVELS = [
    /* First level - too easy */
    {
        intervals: {
            crate: 20000,
            zombie: 3000,
            flyingZombie: 3000,
            flyingZombieFire: 2500,
            jumperZombie: 3000,
            shieldZombie: 3000,
        },
        spawnCounts: {
            zombies: 4,
            flyingZombies: 0,
            jumperZombies: 0,
            shieldZombies: 0,
        },
        pads: [{x: -300, y: 470}, {x: 300, y: 470}, 
               {x: -500, y: 320}, {x: 500,  y: 320}, 
               {x: -300, y: 170}, {x: 300, y: 170},
               {x: 1, y:320 }, {x:-1,y:320}]
    },
    /* Second Level - hummmmm */
    {
        intervals: {
            crate: 20000,
            zombie: 3000,
            flyingZombie: 3000,
            flyingZombieFire: 2500,
            jumperZombie: 3000,
            shieldZombie: 3000,
        },
        spawnCounts: {
            zombies: 4,
            flyingZombies: 0,
            jumperZombies: 4,
            shieldZombies: 0,
        },
        pads: [{x: -300, y: 470}, {x: 300, y: 470}, 
            {x: -500, y: 320}, {x: 500,  y: 320}, 
            {x: -300, y: 170}, {x: 300, y: 170},
            {x: 1, y:320 }, {x:-1,y:320}]
    },
    /* Third Level - that´s more like it */
    {
        intervals: {
            crate: 20000,
            zombie: 3000,
            flyingZombie: 3000,
            flyingZombieFire: 2500,
            jumperZombie: 3000,
            shieldZombie: 3000,

        },
        spawnCounts: {
            zombies: 5,
            flyingZombies: 5,
            jumperZombies: 5,
            shieldZombies: 5,
        },
        pads: [{x: -300, y: 470}, {x: 300, y: 470}, 
            {x: -500, y: 320}, {x: 500,  y: 320}, 
            {x: -300, y: 170}, {x: 300, y: 170},
            {x: 1, y:320 }, {x:-1,y:320}]
    },
    /* Fourth level - HELP! */
    {
        intervals: {
            crate: 20000,
            zombie: 3000,
            flyingZombie: 3000,
            flyingZombieFire: 2500,
            jumperZombie: 3000,
            shieldZombie: 3000,
        },
        spawnCounts: {
            zombies: 10,
            flyingZombies: 10,
            jumperZombies: 20,
            shieldZombies: 10,
        },
        pads: [{x: -300, y: 470}, {x: 300, y: 470}, 
            {x: -200, y: 320}, {x: 200,  y: 320}, 
            {x: -300, y: 170}, {x: 300, y: 170},]
    }
];