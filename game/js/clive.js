var gameIsLost;  // Set to true when the player dies.
var gameIsWon;   // Set to true when the game is won.
var killCounter; // Counts how many zombies are killed.
var waveSize; // Total number of zombies in the wave.
var pads; // This array holds the pads that the player can jump onto.
var bullets; // This array will hold all the bullets displayed on the canvas.
var bulletSpeedMultiplier; // A variable used to determine the value of bullet speed.
var currentLevel = 0;
var nextFrame;

// Variables related to level progress HUD
var hud_clipX;
var hud_clipY;
var hud_clipXLength;
var hud_clipYHeight;
var hud_slotWidth;
// ***************************************

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
	currentPowerUp:null, // 0 = no power up, 1 = spray gun
	livesLeft:null
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
	ground.y = canvas.height - ground.img.height + ground.offset;
    player.x = canvas.width/2;
    player.y = ground.y - player.img.height;
	player.onPad = false;
    player.currentPowerUp = 0;   
	player.livesLeft = 1;	
    initializeCrate();
    currentDirection = true;
    zombies = [];
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

	killCounter = 0;
	waveSize = 10;
	jumpSound.setAttribute("src","aud/jump.wav");
    shootSound.setAttribute("src","aud/shoot.wav");
    zombieDamageSound.setAttribute("src","aud/damage.wav");
    crateSound.setAttribute("src","aud/pickup.wav");
    spawnCrate();
	clouds = [];
	for (var i = 0; i < 4; i++)
        spawnCloud();
	crateInt = setInterval(spawnCrate,20000);
    zombieInt = setInterval(spawnZombie,4000);
	flyingZombieInt = setInterval(spawnFlyingZombie, 7000);
	flyingZombieFireInt = setInterval(fireFlyingZombie, 2500);
	jumperZombieInt = setInterval (spawnJumperZombie, 10000);
    restartImg.x = 635;
    restartImg.y = 330;
    restartImg.onPlay = false;
	playerPortraitBackground.x = canvas.width/50;
	playerPortraitBackground.y = canvas.height/30;
	playerPortraitBackground.onPlay = true;
	playerLives.x1 = canvas.width/50;
	playerLives.x2 = canvas.width/50 + 35;
	playerLives.x3 = canvas.width/50 + 2*35;
	playerLives.x2 = canvas.width/50 + 3*35;
	playerLives.x3 = canvas.width/50 + 4*35;
	playerLives.y = canvas.height/30;
	playerLives.onPlay = true;
	powerupPortraitBackground.x = canvas.width/50;
	powerupPortraitBackground.y = canvas.height/30;
	powerupPortraitBackground.onPlay = true;
	hud_sprayGun.x = canvas.width/50;
	hud_sprayGun.y = canvas.height/30;
	hud_sprayGun.onPlay = true;
	hud_sprayGunBullets.x1 = canvas.width/50;
	hud_sprayGunBullets.x2 = canvas.width/50 + 15;
	hud_sprayGunBullets.x3 = canvas.width/50 + 2*15;
	hud_sprayGunBullets.x4 = canvas.width/50 + 3*15;
	hud_sprayGunBullets.x5 = canvas.width/50 + 4*15;
	hud_sprayGunBullets.y = canvas.height/30;
	hud_sprayGun.onPlay = true;
	hud_diamondGun.x = canvas.width/50;
	hud_diamondGun.y = canvas.height/30;
	hud_diamondGun.onPlay = true;
	hud_diamondGunBullets.x1 = canvas.width/50;
	hud_diamondGunBullets.x2 = canvas.width/50 + 15;
	hud_diamondGunBullets.x3 = canvas.width/50 + 2*15;
	hud_diamondGunBullets.x4 = canvas.width/50 + 3*15;
	hud_diamondGunBullets.x5 = canvas.width/50 + 4*15;
	hud_diamondGunBullets.y = canvas.height/30;
	hud_diamondGunBullets.onPlay = true;
	hud_progressFrame.x = canvas.width/50 + 410;
	hud_progressFrame.y = canvas.height/30;
	hud_progressFrame.onPlay = true;
	hud_progressBackground1.x = canvas.width/50 + 410;
	hud_progressBackground1.y = canvas.height/30;
	hud_progressBackground1.onPlay = true;
	hud_progressBackground2.x = canvas.width/50 + 410;
	hud_progressBackground2.y = canvas.height/30;
	hud_progressBackground2.onPlay = true;
	hud_clipX = 0;
	hud_clipY = 0;
	hud_clipXLength = 0;
	hud_clipYHeight = 0;
	hud_slotWidth = 0;
	
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
    surface.drawImage(background.img, background.x, background.y, canvas.width, canvas.height); // Draw the background.
    drawClouds(surface);
	surface.drawImage(ground.img, ground.x, ground.y, canvas.width, canvas.height); // Draw the ground.
    for (var i = 0; i < pads.length; i++)
    { // For each pad in the pads array, draw it on the canvas.
        surface.drawImage(pads[i].img,pads[i].x,canvas.height - pads[i].y);
    }
    drawCrate(surface);
    drawZombies(surface);
	drawFlyingZombies(surface);
	drawJumperZombies(surface);
	drawSlimes(surface);
    surface.drawImage(player.img,player.x,player.y); // Draw the player.
	drawBullets(surface);
	
	drawPlayerHUD(surface);
	drawProgressHUD(surface);
    if (gameIsLost || gameIsWon) {
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
            var padY = canvas.height - pads[i].y ;
            if (player.y + player.img.height <= padY - player.verticalVelocity && player.y + player.img.height >= padY + player.verticalVelocity)
            { // Then there is a collision between the y coordinates of the player and the pad.
                if (player.x + player.img.width >= pads[i].x && player.x <= pads[i].x + pads[i].img.width)
                { // Then the x coordinates collide as well. We have a collision!
					player.onPad = true;
					pads[i].onPad = true;
                    player.y = padY - player.img.height; // Make sure the player is exactly on the pad.
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
                player.inAir = true;
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
        var padY = canvas.height-pads[i].y;
        if (pads[i].onPad)
        { // Then the player landed on one of the pads.
            player.y = padY - player.img.height; // Make sure the player is exactly on the pad.
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

function drawPlayerHUD(surface)
{
	if (player.currentPowerUp == 1)
	{
		surface.drawImage(powerupPortraitBackground.img,powerupPortraitBackground.x,powerupPortraitBackground.y);
		surface.drawImage(hud_sprayGun.img,hud_sprayGun.x,hud_sprayGun.y);
		if (powerUpAmmo >= 1)
			surface.drawImage(hud_sprayGunBullets.img,hud_sprayGunBullets.x1,hud_sprayGunBullets.y);
		if (powerUpAmmo >= 2)
			surface.drawImage(hud_sprayGunBullets.img,hud_sprayGunBullets.x2,hud_sprayGunBullets.y);
		if (powerUpAmmo >= 3)
			surface.drawImage(hud_sprayGunBullets.img,hud_sprayGunBullets.x3,hud_sprayGunBullets.y);
		if (powerUpAmmo >= 4)
			surface.drawImage(hud_sprayGunBullets.img,hud_sprayGunBullets.x4,hud_sprayGunBullets.y);
		if (powerUpAmmo >= 5)
			surface.drawImage(hud_sprayGunBullets.img,hud_sprayGunBullets.x5,hud_sprayGunBullets.y);
	}
	else if (player.currentPowerUp == 2)
	{
		surface.drawImage(powerupPortraitBackground.img,powerupPortraitBackground.x,powerupPortraitBackground.y);
		surface.drawImage(hud_diamondGun.img,hud_diamondGun.x,hud_diamondGun.y);
		if (powerUpAmmo >= 1)
			surface.drawImage(hud_diamondGunBullets.img,hud_diamondGunBullets.x1,hud_diamondGunBullets.y);
		if (powerUpAmmo >= 2)
			surface.drawImage(hud_diamondGunBullets.img,hud_diamondGunBullets.x2,hud_diamondGunBullets.y);
		if (powerUpAmmo >= 3)
			surface.drawImage(hud_diamondGunBullets.img,hud_diamondGunBullets.x3,hud_diamondGunBullets.y);
		if (powerUpAmmo >= 4)
			surface.drawImage(hud_diamondGunBullets.img,hud_diamondGunBullets.x4,hud_diamondGunBullets.y);
		if (powerUpAmmo >= 5)
			surface.drawImage(hud_diamondGunBullets.img,hud_diamondGunBullets.x5,hud_diamondGunBullets.y);
	}
	surface.drawImage(playerPortraitBackground.img,playerPortraitBackground.x,playerPortraitBackground.y);
	if (player.livesLeft >= 1)
		surface.drawImage(playerLives.img,playerLives.x1,playerLives.y);
	if (player.livesLeft >= 2)
		surface.drawImage(playerLives.img,playerLives.x2,playerLives.y);
	if (player.livesLeft >= 3)
		surface.drawImage(playerLives.img,playerLives.x3,playerLives.y);
}

function drawProgressHUD(surface)
{
	surface.drawImage(hud_progressBackground1.img, hud_progressBackground1.x, hud_progressBackground1.y);
	surface.drawImage(  hud_progressBackground2.img, 
						hud_clipX,
						hud_clipY,
						hud_clipXLength,
						hud_clipYHeight,
						hud_progressBackground2.x, 
						hud_progressBackground2.y, 
						hud_clipXLength,
						hud_clipYHeight);
	surface.drawImage(hud_progressFrame.img, hud_progressFrame.x, hud_progressFrame.y);
	var currentProgress = killCounter + " / " + waveSize;
	surface.font = "34px Arial";
	surface.fillStyle = '#000000';
	surface.fillText(currentProgress, 770, 90);
}

function updateProgressHUD()
{
	var totalWidth = hud_progressBackground2.img.width;
	hud_slotWidth = totalWidth / waveSize;
	hud_clipX = 0;
	hud_clipY = 0;
	hud_clipXLength = hud_slotWidth * killCounter;
	hud_clipYHeight = hud_progressBackground2.img.height;
}