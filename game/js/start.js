const BLACK_TITLE = 10;
const RED_TITLE = 40;
const TOTAL_INTERVAL = 70;
const BLACK = '#000000';
const BLOOD_RED = '#B10610';
const YELLOW = '#FED631';
const MAX_NUM_ZOMBIES = 6;

function startScreen() {
    drawStartBackground(surface);
    drawStartTitle(surface);
    drawStartInstructions(surface);
    moveStartZombies();
    drawZombies(surface);
    startAnimation = requestAnimationFrame(startScreen);
};

function drawStartBackground(ctx){
	background.x = 0;
	background.y = 0;
	ground.offset = 20;
	ground.x = 0;
	ground.y = background.img.height - ground.img.height + ground.offset;
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
    ctx.fillText("Clive Alive",525,360);
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
    ctx.fillText("PRESS SPACE TO START",660,600);
};

function moveStartZombies(){
    if(zombies.length >= MAX_NUM_ZOMBIES)
        clearInterval(startZombieInterval);
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