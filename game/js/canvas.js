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
var playerPortraitBackground = {x:null, y:null, img:null, onPlay:null};
var playerLives = {x1:null, x2:null, x3:null, x4:null, x5:null, y:null, img:null, onPlay:null};
var powerupPortraitBackground = {x:null, y:null, img:null, onPlay:null};
var hud_sprayGun = {x:null, y:null, img:null, onPlay:null};
var hud_sprayGunBullets = {x1:null, x2:null, x3:null, x4:null, x5:null, y:null, img:null, onPlay:null};
var hud_diamondGun = {x:null, y:null, img:null, onPlay:null};
var hud_diamondGunBullets = {x1:null, x2:null, x3:null, x4:null, x5:null, y:null, img:null, onPlay:null};
var hud_progressFrame = {x:null, y:null, img:null, onPlay:null};
var hud_progressBackground1 = {x:null, y:null, img:null, onPlay:null};
var hud_progressBackground2 = {x:null, y:null, img:null, onPlay:null};
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
var cloud1 = {};
var cloud2 = {};
var slime = {};
var shieldZombie = {};
var shieldZombieRight;
var shieldZombieLeft;
var loadedResources = 0;


const NUM_RESOURCES = 21;
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
			canvas.addEventListener("mousemove", playerDirection);
            clearInterval(startZombieInterval);
            clearInterval(startJumpingZombieInterval);
            clearInterval(startFlyingZombieInterval);
            clearInterval(startFlyingZombieFireInt);
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
	
	shieldZombieLeft = new Image();
    shieldZombieLeft.src = "img/ShieldZombieLeft.png";
    shieldZombieLeft.onload = function(){loadCounter(callback);};
	
	shieldZombieRight = new Image();
    shieldZombieRight.src = "img/ShieldZombieRight.png";
    shieldZombieRight.onload = function(){loadCounter(callback);};
    
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
	
	restartImg.img = new Image();
	restartImg.img.src = "img/restart.png";
	restartImg.img.onload = function(){loadCounter(callback);}
	
	playerPortraitBackground.img = new Image();
	playerPortraitBackground.img.src = "img/hud_playerBackground.png";
	playerPortraitBackground.img.onload = function(){loadCounter(callback);}
	
	playerLives.img = new Image();
	playerLives.img.src = "img/hud_live.png";
	playerLives.img.onload = function(){loadCounter(callback);}
	
	powerupPortraitBackground.img = new Image();
	powerupPortraitBackground.img.src = "img/hud_powerupBackground.png";
	powerupPortraitBackground.img.onload = function(){loadCounter(callback);}
	
	hud_sprayGun.img = new Image();
	hud_sprayGun.img.src = "img/hud_sprayGun.png";
	hud_sprayGun.img.onload = function(){loadCounter(callback);}
	
	hud_sprayGunBullets.img = new Image();
	hud_sprayGunBullets.img.src = "img/hud_sprayGunBullet.png";
	hud_sprayGunBullets.img.onload = function(){loadCounter(callback);}
	
	hud_diamondGun.img = new Image();
	hud_diamondGun.img.src = "img/hud_diamondGun.png";
	hud_diamondGun.img.onload = function(){loadCounter(callback);}
	
	hud_diamondGunBullets.img = new Image();
	hud_diamondGunBullets.img.src = "img/hud_diamondGunBullet.png";
	hud_diamondGunBullets.img.onload = function(){loadCounter(callback);}
	
	hud_progressFrame.img = new Image();
	hud_progressFrame.img.src = "img/hud_progressFrame.png";
	hud_progressFrame.img.onload = function(){loadCounter(callback);}
	
	hud_progressBackground1.img = new Image();
	hud_progressBackground1.img.src = "img/hud_progressBackground1.png";
	hud_progressBackground1.img.onload = function(){loadCounter(callback);}
	
	hud_progressBackground2.img = new Image();
	hud_progressBackground2.img.src = "img/hud_progressBackground2.png";
	hud_progressBackground2.img.onload = function(){loadCounter(callback);}
}
