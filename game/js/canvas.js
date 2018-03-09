var canvas = document.querySelector("canvas");
canvas.width = 1600;
canvas.height = 800;
var surface;

// External File Variables
var background = {};
var ground = {};
var loseImage = {};
var restartImg = { x: null, y: null, onPlay: null };
var options = { x: null, y: null, onPlay: null };
var resume = { x: null, y: null, onPlay: null };
var winImage = {};

//var player = {};
var crate = {};

var zombie = {};
var jumperZombie = {};
var flyingZombie = {};
var slime = {};
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

	jumperZombie.img = new Image();
    jumperZombie.img.src = "img/jumperRight.png";
    jumperZombie.img.onload = function(){loadCounter(callback);}
	
	flyingZombie.img = new Image();
    flyingZombie.img.src = "img/FlyingZombieRight.png";
    flyingZombie.img.onload = function(){loadCounter(callback);}
	
	pad1.img = new Image();
	pad1.img.src = "img/pad.png";
	pad1.img.onload = function(){loadCounter(callback);}
	
	pad2.img = new Image();
	pad2.img.src = "img/pad.png";
	pad2.img.onload = function(){loadCounter(callback);}
	
	pad3.img = new Image();
	pad3.img.src = "img/pad.png";
	pad3.img.onload = function(){loadCounter(callback);}
	
	pad4.img = new Image();
	pad4.img.src = "img/pad.png";
	pad4.img.onload = function(){loadCounter(callback);}
	
	pad5.img = new Image();
	pad5.img.src = "img/pad.png";
	pad5.img.onload = function(){loadCounter(callback);}
	
	pad6.img = new Image();
	pad6.img.src = "img/pad.png";
	pad6.img.onload = function(){loadCounter(callback);}
}
