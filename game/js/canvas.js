
var canvas = document.querySelector("canvas");
canvas.height = resolution.height;
canvas.width = resolution.width;
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
var crateImage = {};

var zombie = {};
var jumperZombie = {};
var flyingZombie = {};
var zombieRight = {};
var jumperZombieRight = {};
var flyingZombieRight = {};
var zombieLeft = {};
var jumperZombieLeft = {};
var flyingZombieLeft = {};
var slimeImage = {};
var padImage = {};
var cloud1 = {};
var cloud2 = {};
var slime = {};
var loadedResources = 0;


const NUM_RESOURCES = 17;
var glow = 0;
var startAnimation;
var cloudSprites = [];

window.onload = function()
{
    // gets the context to draw on canvas
    surface = canvas.getContext("2d");
    loadResources(function(){
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
            clearAllIntervals();
            cancelAnimationFrame(startAnimation);
            loadLevel(0);
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
    background.img.onload = function(){loadCounter(callback);};

    ground.img = new Image();
    ground.img.src = "img/ground.png";
    ground.img.onload = function(){loadCounter(callback);};
    
    loseImage = new Image();
    loseImage.src = "img/lose.png";
    loseImage.onload = function(){loadCounter(callback);};

    winImage = new Image();
    winImage.src = "img/win.png";
    winImage.onload = function(){loadCounter(callback);};

    player.img = new Image();
    player.img.src = "img/playerRight.png";
    player.img.onload = function(){loadCounter(callback);};

	crateImage = new Image();
    crateImage.src = "img/crate.png";
    crateImage.onload = function(){loadCounter(callback);};

    zombieRight = new Image();
    zombieRight.src = "img/zombieRight.png";
    zombieRight.onload = function(){loadCounter(callback);};

    zombieLeft = new Image();
    zombieLeft.src = "img/zombieLeft.png";
    zombieLeft.onload = function(){loadCounter(callback);};

    jumperZombieRight = new Image();
    jumperZombieRight.src = "img/jumperRight.png";
    jumperZombieRight.onload = function(){loadCounter(callback);};

    jumperZombieLeft = new Image();
    jumperZombieLeft.src = "img/jumperLeft.png";
    jumperZombieLeft.onload = function(){loadCounter(callback);};

    flyingZombieRight = new Image();
    flyingZombieRight.src = "img/FlyingZombieRight.png";
    flyingZombieRight.onload = function(){loadCounter(callback);};

    flyingZombieLeft = new Image();
    flyingZombieLeft.src = "img/FlyingZombieLeft.png";
    flyingZombieLeft.onload = function(){loadCounter(callback);};
    
	slimeImage = new Image();
    slimeImage.src = "img/slime.png";
    slimeImage.onload = function(){loadCounter(callback);};

    cloud1 = new Image();
    cloud1.src = "img/cloud1.png";
    cloud1.onload = function(){loadCounter(callback);};

    cloud2 = new Image();
    cloud2.src = "img/cloud2.png";
    cloud2.onload = function(){loadCounter(callback);};

    cloudSprites = [cloud1, cloud2];
	
	padImage = new Image();
	padImage.src = "img/pad.png";
	padImage.onload = function(){loadCounter(callback);};
	
	restartImg.img = new Image();
	restartImg.img.src = "img/restart.png";
	restartImg.img.onload = function(){loadCounter(callback);}
	
}
