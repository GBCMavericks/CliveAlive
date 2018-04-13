var canvas = document.querySelector("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
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
var jumperZombieRight = {};
var jumperZombieRightAir = {};
var jumperZombieLeft = {};
var jumperZombieLeftAir = {};
var flyingZombieRight = {};
var flyingZombieLeft = {};
var slimeImage = {};
var padImage = {};
var cloud1 = {};
var cloud2 = {};
var slime = {};
var shieldZombie = {};
var shieldZombieRight;
var shieldZombieLeft;
var loadedResources = 0;
var playerAnim = {
    Idle: [],
    Shooting:[],
    Running:[],
    Jumping:[],
};

var menuImage = {}
var buttonImage = {};
var windowImage = {};

const NUM_RESOURCES = 107;
var zombieRightWalk = [];
var zombieLeftWalk = [];
var zombieRightIdle = [];
var zombieLeftIdle = [];
var zombieRightDead = [];
var zombieLeftDead = [];

var glow = 0;
var startAnimation;
var cloudSprites = [];

var bulletImage; //= new Image();
var bulletImageD;// = new Image();

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
            canvas.addEventListener("mousemove", playerDirection);
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

    bulletImage = new Image();
    bulletImage.src = "img/bullet.png";
    bulletImage.onload = function(){loadCounter(callback);};

    bulletImageD = new Image();
    bulletImageD.src = "img/diBullet.png";
    bulletImageD.onload = function(){loadCounter(callback);};

	for (var i = 0; i < 6; i++)
	{
		zombieRightWalk[i] = new Image();
		zombieRightWalk[i].src = "img/Zombie/WalkRight" + (i+1) + ".png";
		zombieRightWalk[i].onload = function(){loadCounter(callback);};
	}
	
	for (var i = 0; i < 6; i++)
	{
		zombieLeftWalk[i] = new Image();
		zombieLeftWalk[i].src = "img/Zombie/WalkLeft" + (i+1) + ".png";
		zombieLeftWalk[i].onload = function(){loadCounter(callback);};
	}
	
	for (var i = 0; i < 7; i++)
	{
		zombieRightIdle[i] = new Image();
		zombieRightIdle[i].src = "img/Zombie/IdleRight" + (i+1) + ".png";
		zombieRightIdle[i].onload = function(){loadCounter(callback);};
	}
	
	for (var i = 0; i < 7; i++)
	{
		zombieLeftIdle[i] = new Image();
		zombieLeftIdle[i].src = "img/Zombie/IdleLeft" + (i+1) + ".png";
		zombieLeftIdle[i].onload = function(){loadCounter(callback);};
	}
	
	for (var i = 0; i < 8; i++)
	{
		zombieRightDead[i] = new Image();
		zombieRightDead[i].src = "img/Zombie/DeadRight" + (i+1) + ".png";
		zombieRightDead[i].onload = function(){loadCounter(callback);};
	}
	
	for (var i = 0; i < 8; i++)
	{
		zombieLeftDead[i] = new Image();
		zombieLeftDead[i].src = "img/Zombie/DeadLeft" + (i+1) + ".png";
		zombieLeftDead[i].onload = function(){loadCounter(callback);};
	}
	
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

	crateImage = new Image();
    crateImage.src = "img/crate.png";
    crateImage.onload = function(){loadCounter(callback);};

    jumperZombieRight = new Image();
    jumperZombieRight.src = "img/jumperRight.png";
    jumperZombieRight.onload = function(){loadCounter(callback);};

    jumperZombieLeft = new Image();
    jumperZombieLeft.src = "img/jumperLeft.png";
    jumperZombieLeft.onload = function(){loadCounter(callback);};
	
	jumperZombieLeftAir = new Image();
    jumperZombieLeftAir.src = "img/jumperLeftAir.png";
    jumperZombieLeftAir.onload = function(){loadCounter(callback);};
	
	jumperZombieRightAir = new Image();
    jumperZombieRightAir.src = "img/jumperRightAir.png";
    jumperZombieRightAir.onload = function(){loadCounter(callback);};

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
	
	padImage = new Image();
	padImage.src = "img/pad.png";
	padImage.onload = function(){loadCounter(callback);};
	
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
    
    for(var idleAnim = 0; idleAnim < 12; idleAnim++){
        playerAnim.Idle[idleAnim] = new Image();
        playerAnim.Idle[idleAnim].src = "img/Player/Idle_" + formatNumberLength(idleAnim,3) + ".png";
        playerAnim.Idle[idleAnim].onload = function(){loadCounter(callback);}
    }
    player.img = playerAnim.Idle[0];

    for(var shootingAnim = 0; shootingAnim < 5; shootingAnim++){
        playerAnim.Shooting[shootingAnim] = new Image();
        playerAnim.Shooting[shootingAnim].src = "img/Player/Shot_" + formatNumberLength(shootingAnim,3) + ".png";
        playerAnim.Shooting[shootingAnim].onload = function(){loadCounter(callback);}
    }

    for(var runningAnim = 0; runningAnim < 10; runningAnim++){
        playerAnim.Running[runningAnim] = new Image();
        playerAnim.Running[runningAnim].src = "img/Player/RunWithGun_" + formatNumberLength(runningAnim,3) + ".png";
        playerAnim.Running[runningAnim].onload = function(){loadCounter(callback);}
    }

    for(var jumpingAnim = 0; jumpingAnim < 6; jumpingAnim++){
        playerAnim.Jumping[jumpingAnim] = new Image();
        playerAnim.Jumping[jumpingAnim].src = "img/Player/Jump_" + formatNumberLength(jumpingAnim,3) + ".png";
        playerAnim.Jumping[jumpingAnim].onload = function(){loadCounter(callback);}
    }

    menuImage = new Image();
    menuImage.src = "img/Menu.png";
    menuImage.onload = function(){loadCounter(callback);}

    buttonImage= new Image();
    buttonImage.src = "img/Menu.png";
    buttonImage.onload = function(){loadCounter(callback);}

    windowImage = new Image();
    windowImage.src = "img/Window.png";
    windowImage.onload = function(){loadCounter(callback);}


}

function formatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}
