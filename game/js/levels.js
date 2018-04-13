const NEVER = -1;

const LEVELS = [
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
            jumperZombies: 4
        },
        pads: [{x: -300, y: 470}, {x: 300, y: 470}, 
            {x: -500, y: 320}, {x: 500,  y: 320}, 
            {x: -300, y: 170}, {x: 300, y: 170},
            {x: 1, y:320 }, {x:-1,y:320}]
    },
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
            shieldZombies: 3,
        },
        pads: [{x: -300, y: 470}, {x: 300, y: 470}, 
            {x: -500, y: 320}, {x: 500,  y: 320}, 
            {x: -300, y: 170}, {x: 300, y: 170},
            {x: 1, y:320 }, {x:-1,y:320}]
    },
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
            jumperZombies: 10
        },
        pads: [{x: -300, y: 470}, {x: 300, y: 470}, 
            {x: -500, y: 320}, {x: 500,  y: 320}, 
            {x: -300, y: 170}, {x: 300, y: 170},
            {x: 1, y:320 }, {x:-1,y:320}]
}
];