const BLACK_TITLE = 10;
const RED_TITLE = 40;
const TOTAL_INTERVAL = 70;
const MAX_NUM_ZOMBIES = 3;
const MAX_NUM_FLYING_ZOMBIES = 5;
const MAX_NUM_JUMPING_ZOMBIES = 3;
const MAX_NUM_SLIMES = 10;

var startZombieInterval = null; 
var startJumpingZombieInterval = null;
var startFlyingZombieInterval = null;
var startFlyingZombieFireInt = null; 

var titleOffset = {
    width: 300,
    height: 150
};
var titleFontSize = 120;
var messageOffset = {
    width: 175,
    height: 100
};

function startScreen() {
    drawStartBackground(surface);
    drawStartTitle(surface);
    drawStartInstructions(surface);
    drawStartMenu(surface);
    if(reinforcements.zombies == null){
        reinforcements = {
            zombies: 6,
            flyingZombies: 6,
            jumperZombies: 3
        };
    }
    if(startZombieInterval == null){
        startZombieInterval = setInterval(spawnZombie,1000);
    }
    if(startFlyingZombieInterval == null){
        startFlyingZombieInterval = setInterval(spawnFlyingZombie,1500);
        startFlyingZombieFireInt = setInterval(fireFlyingZombie, 2500);
    }
    if(clouds.length == 0){
        for(var i = 0; i < 4; i++)
        {
            spawnCloud();
        }
    }
    moveClouds();
    moveStartZombies();
    moveSlime();
    animateZombie();
    drawZombies(surface);
    drawFlyingZombies(surface);
    drawSlimes(surface);
    drawButtons(surface);
    cleanSlimesArray();
    //console.log(slimes.length);
    startAnimation = requestAnimationFrame(startScreen);
}

function drawStartBackground(ctx){
	background.x = 0;
	background.y = 0;
	ground.offset = 20;
	ground.x = 0;
	ground.y = canvas.height - ground.img.height + ground.offset;
    ctx.clearRect(0,0,canvas.width,canvas.height); // Clear the canvas first.
    ctx.rect(0,0, ctx.width,ctx.height);
    ctx.fillStyle = BLACK;
    ctx.fill();
    ctx.drawImage(background.img, background.x, background.y, canvas.width, canvas.height); // Draw the background.
    drawClouds(ctx);
	ctx.drawImage(ground.img, ground.x, ground.y, canvas.width, ground.img.height); // Draw the ground.
    ctx.restore();
}


function drawStartTitle(ctx){
    ctx.font = titleFontSize + "px zombieSlayer";
    ctx.fillStyle = BLOOD_RED;
    ctx.fillText("Clive Alive",
                 (canvas.width / 2)-titleOffset.width,
                 titleOffset.height);
};

function drawStartMenu(ctx){
    /*ctx.rect((canvas.width / 2)-messageOffset.width,(canvas.height/2)-messageOffset.height);
    if(buttons.length == 0){
        buttons.push({
            left: 120,
            top: 120,
            width:120,
            text:'START',
        });
    }
    */
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
    ctx.fillText("PRESS SPACE TO START",
                 (canvas.width / 2)-messageOffset.width,
                 (canvas.height/2)-messageOffset.height);
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
        if (zombieAtHand.direction){
            zombieAtHand.x += ZOMBIE_SPEED;
            if(zombieAtHand.x >= (canvas.width - zombieAtHand.img.width)){
                // turn around
                zombieAtHand.img = zombieLeftWalk[0];
                zombieAtHand.x -= ZOMBIE_SPEED;
                zombieAtHand.direction = false;
            }
        }
        else{
            zombieAtHand.x -= ZOMBIE_SPEED;                    
            if(zombieAtHand.x <= 0){
                zombieAtHand.img = zombieRightWalk[0];
                zombieAtHand.x += ZOMBIE_SPEED;
                zombieAtHand.direction = true;
            }            
        }
	}
}