var gameIsLost;  // Set to true when the player dies.
var gameIsWon;   // Set to true when the game is won.
var killCounter; // Counts how many zombies are killed.
var pads; // This array holds the pads that the player can jump onto.
var bullets; // This array will hold all the bullets displayed on the canvas.
var bulletSpeedMultiplier; // A variable used to determine the value of bullet speed.
var currentLevel = 0;
var nextFrame;

// INTERVALS ************************************************************************************************************************
var intervals = {
    crate: null,
    zombie: null,
    flyingZombie: null,
    flyingZombieFire: null,
    jumperZombie: null
};
// END OF INTERVALS *****************************************************************************************************************

// PLAYER RELATED VARIABLES **********************************************************************************************************
var player = 
{
	img:null,
	x:null,
	y:null,
	inAir:false,
	onPad:null,
	verticalVelocity:0, // Vertical velocity of the player.
	currentPowerUp:null // 0 = no power up, 1 = spray gun
};
const JUMP_INITIAL_VELOCITY = 600 / FPS; // The player's vertical velocity at the beginning of a jump.
const GRAVITY_MULTIPLIER = 40;
const GRAVITY = (GRAVITY_MULTIPLIER / FPS) / (FPS / 30);
const PLAYER_SPEED = 240 / FPS;
const BULLET_SPEED_MULTIPLIER = 1200 / FPS; // A variable used to determine the value of bullet speed.
var currentDirection; // Used to keep track of player's direction. (true=right false=left)
var jumpSound = document.createElement("audio"); // This is the jump sound effect, weeeeeeeee!
var shootSound = document.createElement("audio"); // Shooting sound effect.
// END OF PLAYER RELATED VARIABLES ***************************************************************************************************

var leftPressed = false; // These flags are used  
var rightPressed = false;// to keep track of which
var upPressed = false;   // keyboard button the
var downPressed = false; // player presses.

var isPaused = false;


function setGameInterval(fn, interval)
{
    if(interval != NEVER)
        return setInterval(fn, interval);
    else
        return null;
}

function loadLevel(levelNumber)
{
    var level = LEVELS[levelNumber];
    currentLevel = levelNumber;
    pads = level.pads;
    reinforcements.zombies = level.spawnCounts.zombies;
    reinforcements.flyingZombies = level.spawnCounts.flyingZombies;
    reinforcements.jumperZombies = level.spawnCounts.jumperZombies;
    intervals.crate = setGameInterval(spawnCrate, level.intervals.crate);
    intervals.zombie = setGameInterval(spawnZombie, level.intervals.zombie);
    intervals.flyingZombie = setGameInterval(spawnFlyingZombie, level.intervals.flyingZombie);
    intervals.flyngZombieFire = setGameInterval(fireFlyingZombie, level.intervals.flyingZombieFire);
    intervals.jumperZombie = setGameInterval (spawnJumperZombie, level.intervals.jumperZombie);
    createMap();
}

function createMap() // Initialize all the variables here.
{
	leftPressed = false; 
	rightPressed = false;
	upPressed = false;   
	downPressed = false; 
	background.x = 0;
	background.y = 0;
	ground.offset = 40;
	ground.x = 0;
	ground.y = background.img.height - ground.img.height + ground.offset;
    player.x = 600;
    player.y = ground.y - player.img.height;
	player.onPad = false;
    player.currentPowerUp = 0;    
    initializeCrate();
    currentDirection = true;
    zombies = [];
    /*
    zombie.lives = 3;
    zombie.x = -zombieRight.width;
    zombie.y = ground.y - zombieRight.height;*/
    flyingZombies = [];
    slimes = [];
    bullets = [];
    bulletSpeedMultiplier = 10;
	jumperZombies = [];
	for (var i = 0; i < pads.length; i++)
	{
		pads[i].onPad = false;
		pads[i].onPadZombie = false;
		pads[i].img = padImage;

	}
    gameIsLost = false;
    gameIsWon = false;
	jumpSound.setAttribute("src","aud/jump.wav");
    shootSound.setAttribute("src","aud/shoot.wav");
    zombieDamageSound.setAttribute("src","aud/damage.wav");
    crateSound.setAttribute("src","aud/pickup.wav");
    spawnCrate();
	clouds = [];
	for (var i = 0; i < 4; i++)
        spawnCloud();
    //buttons values
    restartImg.x = 635;
    restartImg.y = 330;
    restartImg.onPlay = false;

    update();
}

function update()
{
    if(checkForWin())
    {
        if(!gameIsWon)
        {
            loadLevel(++currentLevel);
            return; // Let a new loop run for the next level.
        }
        else
            render(); // Render the win screen forever.
    }
    moveZombie();
    movePlayer();
    moveBullet();
	moveCrate();
	moveFlyingZombie();
	moveSlime();
	moveJumperZombie();
	moveClouds();
	collisionCrateGround();
	collisionCratePad();
	collisionCratePlayer();
    collisionBulletZombie();
    collisionPlayerZombie();
    collisionPlayerPad();
    collisionBulletPad();
    collisionBulletGround();
	collisionBulletFlyingZombie();
	collisionPlayerFlyingZombie();
	collisionSlimeGround();
	collisionSlimePlayer();
	collisionPlayerJumperZombie();
	collisionBulletJumperZombie();
	collisionJumperZombiePad();
    playerGravity();
	zombieGravity();
    render();
    cleanZombieArray();
	cleanFlyingZombieArray();
    cleanBulletArray();
	cleanSlimesArray();
	cleanJumperZombieArray();
}

function clearAllIntervals()
{
    for(var interval in intervals)
        clearInterval(interval);
}

function render()
{
    surface.clearRect(0,0,canvas.width,canvas.height); // Clear the canvas first.
    surface.drawImage(background.img, background.x, background.y); // Draw the background.
    drawClouds(surface);
	surface.drawImage(ground.img, ground.x, ground.y); // Draw the ground.
    for (var i = 0; i < pads.length; i++)
    { // For each pad in the pads array, draw it on the canvas.
        surface.drawImage(pads[i].img,pads[i].x,pads[i].y);
    }
    drawCrate(surface);
    drawZombies(surface);
	drawFlyingZombies(surface);
	drawJumperZombies(surface);
	drawSlimes(surface);
    surface.drawImage(player.img,player.x,player.y); // Draw the player.
	
	drawBullets(surface);
	
    if (gameIsLost || gameIsWon)
    {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        canvas.removeEventListener("click", fire);
        if (gameIsLost)
        {
            canvas.addEventListener("click", restartGame);
            surface.drawImage(loseImage, 602, 220);
            restartImg.onPlay = true;
        }
        if (gameIsWon) 
		{
			surface.drawImage(winImage, 602, 220);
		}
        clearAllIntervals();
    }
    else if (!isPaused) {
        nextFrame = requestAnimationFrame(update);
    }
    else if (isPaused)
    {
        surface.drawImage(resume.img, 230, 300);
        clearAllIntervals();
    }
	if(restartImg.onPlay == true)
	{
		surface.drawImage(restartImg.img, restartImg.x, restartImg.y);
	}
}

function collisionCrateGround()
{
	if (crate.y + crateImage.height >= ground.y)
	{
		crate.onGround = true;
		crate.onPad = false;
		crate.y = ground.y - crateImage.height;
	}
}

function collisionCratePad()
{
	for (var i = 0; i < pads.length; i++)
    { // For each pad in the pads array:
        if (crate.y + crateImage.height <= pads[i].y + pads[i].img.height - CRATE_SPEED 
            && crate.y + crateImage.height >= pads[i].y + CRATE_SPEED)
		{ // Then there is a collision between the y coordinates of the crate and the pad.
            if (crate.x + crateImage.width >= pads[i].x 
                && crate.x <= pads[i].x + pads[i].img.width)
			{
				crate.onPad = true;
				crate.y = pads[i].y - crate.img.height; // Make sure the crate is exactly on the pad.
			}
		}
    }
}

function collisionCratePlayer()
{
	if (!crate.hide)
	{
        if (player.x + player.img.width >= crate.x 
            && player.x <= crate.x + crateImage.width)
		{ // Then the x coordinates collide.
            if (player.y + player.img.height >= crate.y 
                && player.y <= crate.y + crateImage.height)
			{ // Then the y coordinates collide. We have a collision!
				currentPowerUp = Math.floor((Math.random() * 2) + 1);
				powerUpAmmo = POWERUP_USES;
				crate.hide = true;
				crateSound.play();
			}
		}
	}
}

function movePlayer()
{
    if (leftPressed && player.x > 0)
    {
        if (upPressed)
            player.img.src = "img/playerLeftJump.png";
        else
            player.img.src = "img/playerLeft.png";
        player.x = player.x - PLAYER_SPEED;
        currentDirection = false;
    }
    if (rightPressed && player.x < (canvas.width - player.img.width))
    {
        if (upPressed)
            player.img.src = "img/playerRightJump.png";
        else
            player.img.src = "img/playerRight.png";
        player.x = player.x + PLAYER_SPEED;
        currentDirection = true;
    }
    if (upPressed && !player.inAir)
    {
        for (var i = 0; i < pads.length; i++)
        {
            pads[i].onPad = false; // Player is NOT on any of the pads while jumping.
        }
        if(currentDirection)
        {
            player.img.src = "img/playerRightJump.png";
        }
        else
        {
            player.img.src = "img/playerLeftJump.png";
        }

        player.verticalVelocity = JUMP_INITIAL_VELOCITY;
        player.inAir = true;
		player.onPad = false;
        jumpSound.play();
    }
}


function collisionPlayerPad()
{
    for ( var i = 0; i < pads.length; i++)
    { // For each pad in the pads array:
        if (player.inAir) // We only want to check collision between the pad and the player when the player is falling down.
        {
            if (player.y + player.img.height <= pads[i].y - player.verticalVelocity && player.y + player.img.height >= pads[i].y + player.verticalVelocity)
            { // Then there is a collision between the y coordinates of the player and the pad.
                if (player.x + player.img.width >= pads[i].x && player.x <= pads[i].x + pads[i].img.width)
                { // Then the x coordinates collide as well. We have a collision!
					player.onPad = true;
					pads[i].onPad = true;
                    player.y = pads[i].y - player.img.height; // Make sure the player is exactly on the pad.
                    resetJump(); // Reset the jump variables so the next jump is not screwed up.
                    if(currentDirection)
                    {
                        player.img.src = "img/playerRight.png";
                    }
                    else
                    {
                        player.img.src = "img/playerLeft.png";
                    }
                }
            }
        }
        if (pads[i].onPad) // This part captures the moment when the player leaves the pad, so the fall animation can start.
        {
            if (player.x > pads[i].x + pads[i].img.width || player.x + player.img.width < pads[i].x)
            { // Then the player left the pad, time to apply gravity.
                inAir = true;
                player.onPad = false;
				pads[i].onPad = false;
            }
        }
    }
}


function playerGravity()
{
    player.y -= player.verticalVelocity; // Move the player up or down according to the vertical velocity.
    player.verticalVelocity -= GRAVITY; // Decelerate the player due to gravity.
    if(currentDirection)
    {
        player.img.src = "img/playerRightJump.png";
    }
    else
    {
        player.img.src = "img/playerLeftJump.png";
    }
    for (var i = 0; i < pads.length; i++)
    { // For all the pads in the pads array:
        if (pads[i].onPad)
        { // Then the player landed on one of the pads.
            player.y = pads[i].y - player.img.height; // Make sure the player is exactly on the pad.
            resetJump(); // Reset the jump variables so the next jump is not screwed up.
            if(currentDirection)
            {
                player.img.src = "img/playerRight.png";
            }
            else
            {
                player.img.src = "img/playerLeft.png";
            }
        }
    }
    if (player.y + player.img.height >= ground.y)
    { // Then the player reached the ground, time to stop.
        player.y = ground.y - player.img.height; // Make sure the player does not go below ground.
        resetJump(); // Reset the jump variables so the next jump is not screwed up.
        if(currentDirection)
        {
            player.img.src = "img/playerRight.png";
        }
        else
        {
            player.img.src = "img/playerLeft.png";
        }
    }
}

function resetJump()
{
    player.inAir = false;
    player.verticalVelocity = 0;
}

function resetJumpZombie(thisZombie)
{
	thisZombie.inAir = false;
	thisZombie.verticalVelocity = 0;
}

function onKeyDown(event)
{
    switch (event.keyCode)
    {
        case 65:
            leftPressed = true;
            break;
        case 68:
            rightPressed = true;
            break;
        case 87:
        case 119:
            upPressed = true;
    }
}

function onKeyUp(event)
{
    switch (event.keyCode)
    {
        case 65:
            leftPressed = false;
            break;
        case 68:
            rightPressed = false;
            break;
        case 87:
        case 119:
            upPressed = false;
    }
}

function checkForWin()
{
    for(var typeOfZombie in reinforcements)
        if(reinforcements[typeOfZombie] > 0)
            return false;
    if(zombies.length == 0 && flyingZombies.length == 0 && jumperZombies.length == 0)
    {
        if (currentLevel == LEVELS.length - 1)
            gameIsWon = true;
        return true;
    }
}

function restartGame(event)
{
    var mouseX = event.clientX - surface.canvas.offsetLeft;
    var mouseY = event.clientY - surface.canvas.offsetTop;
	// detecting mouse click
	if(mouseX >= restartImg.x && mouseX <= restartImg.x + restartImg.img.width)
	{
		if(mouseY >= restartImg.y && mouseY <= restartImg.y + restartImg.img.height)
		{
			//add listeneres back and removing listener for restart button
			window.addEventListener("keydown", onKeyDown);
			window.addEventListener("keyup", onKeyUp);
			canvas.removeEventListener("click", restartGame);
			canvas.addEventListener("click", fire);
			//generating the game again
			loadLevel(0);
		}	
	}
}
