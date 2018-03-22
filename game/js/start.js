const BLACK_TITLE = 10;
const RED_TITLE = 40;
const TOTAL_INTERVAL = 70;
const BLACK = '#000000';
const BLOOD_RED = '#B10610';
const YELLOW = '#FED631';
const MAX_NUM_ZOMBIES = 3;
const MAX_NUM_FLYING_ZOMBIES = 5;
const MAX_NUM_JUMPING_ZOMBIES = 3;

var startZombieInterval = null; 
var startJumpingZombieInterval = null;
var startFlyingZombieInterval = null;

var titleOffset = {
    width: 300,
    height: 200
};
var messageOffset = {
    width: 175,
    height: 100
};

function startScreen() {
    drawStartBackground(surface);
    drawStartTitle(surface);
    drawStartInstructions(surface);
    if(startZombieInterval == null){
        startZombieInterval = setInterval(spawnZombie,1000);
    }
    //if(startJumpingZombieInterval == null)
    if(startFlyingZombieInterval == null){
        console.log('starting fying zombies');
        startFlyingZombieInterval = setInterval(spawnFlyingZombie,1500);
    }
    moveStartZombies();
    drawZombies(surface);
    drawFlyingZombies(surface);
    startAnimation = requestAnimationFrame(startScreen);
};

function drawStartBackground(ctx){
	background.x = 0;
	background.y = 0;
	ground.offset = 20;
	ground.x = 0;
	ground.y = canvas.height - ground.img.height + ground.offset;
    ctx.clearRect(0,0,canvas.width,canvas.height); // Clear the canvas first.
    ctx.rect(0,0, ctx.width,ctx.height);
    ctx.fillStyle="black";
    ctx.fill();
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.drawImage(background.img, background.x, background.y); // Draw the background.
	ctx.drawImage(ground.img, ground.x, ground.y); // Draw the ground.
    ctx.restore();
}

function drawStartTitle(ctx){
    ctx.font = "120px zombieSlayer";
    ctx.fillStyle = BLOOD_RED;
    ctx.fillText("Clive Alive",(canvas.width / 2)-titleOffset.width,(canvas.height/2)-titleOffset.height);
};
function drawStartMenu()
{

};

function drawStartInstructions(ctx){
    glow++;
    ctx.font="30px verdana";

    if(glow < BLACK_TITLE){
        ctx.fillStyle="#000000";        
    }
    else if(glow >= BLACK_TITLE && glow < RED_TITLE){
        ctx.fillStyle = BLOOD_RED;
    }
    else{
        ctx.fillStyle = YELLOW;
    }
    if(glow > TOTAL_INTERVAL)
        glow = 0;
    ctx.fillText("PRESS SPACE TO START",(canvas.width / 2)-messageOffset.width,(canvas.height/2)-messageOffset.height);
};

function moveStartZombies(){
    if(zombies.length >= MAX_NUM_ZOMBIES){
        clearInterval(startZombieInterval);
    }
    if(flyingZombies.length >= MAX_NUM_FLYING_ZOMBIES){
        clearInterval(startFlyingZombieInterval);        
    }
    moveFlyingZombie();
    for (var i = 0; i < zombies.length; i++)
	{
        var zombieAtHand = zombies[i];
        if (zombieAtHand.img.src.indexOf('Right') >= 0){
            zombieAtHand.x += ZOMBIE_SPEED;
            if(zombieAtHand.x >= (canvas.width - zombieAtHand.img.width)){
                // turn around brigth eyes
                zombieAtHand.img.src = "img/zombieLeft.png";
                zombieAtHand.x -= ZOMBIE_SPEED;                    
            }
        }
        else{
            zombieAtHand.x -= ZOMBIE_SPEED;                    
            if(zombieAtHand.x <= 0){
                // turn around brigth eyes
                zombieAtHand.img.src = "img/zombieRight.png";
                zombieAtHand.x += ZOMBIE_SPEED;                    
            }            
        }
	}
}