var canvas = document.querySelector("canvas");
canvas.width = 800; 	
canvas.height = 400;
var surface;

// External File Variables
var background = {};
var ground = {};
var loseImage = {};
var winImage = {};
//var player = {};
var crate = {};
var zombie = {};
//var pad1 = {};
//var pad2 = {};
var loadedResources = 0;
const NUM_RESOURCES = 9;
var glow = 0;
var startZombieInterval; 
var startAnimation;


window.onload = function()
{
    // gets the context to draw on canvas
    surface = canvas.getContext("2d");
    loadResources(function(){
        startZombieInterval = setInterval(spawnZombie,1000);
        window.addEventListener("keydown", onSpaceDown);
        startScreen();
    });
};

function onSpaceDown(event){
    switch (event.keyCode)
    {
        case 32:
            window.removeEventListener("keydown", onSpaceDown);
            window.addEventListener("keydown", onKeyDown);
            window.addEventListener("keyup", onKeyUp);
            canvas.addEventListener("click", fire);
            clearInterval(startZombieInterval);
            cancelAnimationFrame(startAnimation);
            createMap();
    }

};

function loadCounter(callback){
    if(++loadedResources == NUM_RESOURCES){
        callback();
    }    
}

function loadResources(callback){
    background.img = new Image();
    background.img.src = "img/background.jpg";
    background.img.onload = function(){loadCounter(callback);}

    ground.img = new Image();
    ground.img.src = "img/ground.png";
    ground.img.onload = function(){loadCounter(callback);}
    
    loseImage = new Image();
    loseImage.src = "img/lose.png";
    loseImage.onload = function(){loadCounter(callback);}

    winImage = new Image();
    winImage.src = "img/win.png";
    winImage.onload = function(){loadCounter(callback);}

    player.img = new Image();
    player.img.src = "img/playerRight.png";
    player.img.onload = function(){loadCounter(callback);}

	crate.img = new Image();
    crate.img.src = "img/crate.png";
    crate.img.onload = function(){loadCounter(callback);}
    
    zombie.img = new Image();
    zombie.img.src = "img/zombieRight.png";
    zombie.img.onload = function(){loadCounter(callback);}

    pad1.img = new Image();
    pad1.img.src = "img/pad.png";
    pad1.img.onload = function(){loadCounter(callback);}

    pad2.img = new Image();
    pad2.img.src = "img/pad.png";
    pad2.img.onload = function(){loadCounter(callback);}
}


/*

var uInt;        // Variable for setInterval.

var gameIsLost = false  // Set to true when the player dies.
var gameIsWon = false;   // Set to true when the game is won.
*/

