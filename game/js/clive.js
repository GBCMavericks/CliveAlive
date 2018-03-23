var gameIsLost;  // Set to true when the player dies.
var gameIsWon;   // Set to true when the game is won.
var killCounter; // Counts how many zombies are killed.
var pad1 = {img:null,x:null,y:null,onPad:null,onPadZombie:null}; 
var pad2 = {img:null,x:null,y:null,onPad:null,onPadZombie:null}; 
var pad3 = {img:null,x:null,y:null,onPad:null,onPadZombie:null};
var pad4 = {img:null,x:null,y:null,onPad:null,onPadZombie:null};
var pads; // This array holds the pads that the player can jump onto.
var bullets; // This array will hold all the bullets displayed on the canvas.
var bulletSpeedMultiplier; // A variable used to determine the value of bullet speed.

// INTERVALS ************************************************************************************************************************
var crateInt;    // Crate spawn interval.
var flyingZombieInt; // Flying zombie spawn interval.
var flyingZombieFireInt; // Flying zombie fire (slime ball) interval.
var jumperZombieInt; // Jumper zombie spawn interval.
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
const maxKillCount = 30;
var currentDirection;// Used to keep track of player's direction. (true=right false=left)
var jumpSound = document.createElement("AUDIO"); // This is the jump sound effect, weeeeeeeee!
var shootSound = document.createElement("AUDIO"); // Shooting sound effect.
// END OF PLAYER RELATED VARIABLES ***************************************************************************************************

var leftPressed = false; // These flags are used  
var rightPressed = false;// to keep track of which
var upPressed = false;   // keyboard button the
var downPressed = false; // player presses.

var isPaused = false;

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
	player.livesLeft = 1;	
    initializeCrate();
    currentDirection = true;
    zombies = [];
    flyingZombies = [];
    slimes = [];
    bullets = [];
    bulletSpeedMultiplier = 10;
    pads = [];
	jumperZombies = [];
    pad1.x = 300;
    pad1.y = 600;
	pads.push(pad1);
	pad2.x = 1100;
    pad2.y = 600;
	pads.push(pad2);
	pad3.x = 500;
	pad3.y = 450;
	pads.push(pad3);
	pad4.x = 900;
	pad4.y = 450;
	pads.push(pad4);
	for (var i = 0; i < pads.length; i++)
	{
		pads[i].onPad = false;
		pads[i].onPadZombie = false;
	}
    gameIsLost = false;
    gameIsWon = false;
	killCounter = 0;
	jumpSound.setAttribute("src","aud/jump.wav");
    shootSound.setAttribute("src","aud/shoot.wav");
    zombieDamageSound.setAttribute("src","aud/damage.wav");
    crateSound.setAttribute("src","aud/pickup.wav");
    spawnCrate();
	crateInt = setInterval(spawnCrate,20000);
    zombieInt = setInterval(spawnZombie,5000);
	flyingZombieInt = setInterval(spawnFlyingZombie, 7000);
	flyingZombieFireInt = setInterval(fireFlyingZombie, 2500);
	jumperZombieInt = setInterval (spawnJumperZombie, 9000);
	for(var i = 0; i < 4; i++)
        spawnCloud();
    restartImg.x = 635;
    restartImg.y = 330;
    restartImg.onPlay = false;
	playerPortraitBackground.x = canvas.width/50;
	playerPortraitBackground.y = canvas.height/30;
	playerPortraitBackground.onPlay = true;
	playerLives.x1 = canvas.width/50 + 120;
	playerLives.x2 = canvas.width/50 + 120 + 50;
	playerLives.x3 = canvas.width/50 + 120 + 2*50;
	playerLives.y = canvas.height/30 + 35;
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
	
    update();
}

function update()
{
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
	drawHUD(surface);
    if (gameIsLost || gameIsWon) {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        canvas.removeEventListener("click", fire);
        if (gameIsLost) {
            canvas.addEventListener("click", restartGame);
            surface.drawImage(loseImage, 602, 220);
            restartImg.onPlay = true;
        }
        if (gameIsWon) 
		{
			surface.drawImage(winImage, 602, 220);
		}
        //clearInterval(uInt);
        clearInterval(crateInt);
        clearInterval(zombieInt);
        clearInterval(flyingZombieInt);
        clearInterval(flyingZombieFireInt);
    }
    else if (!isPaused) {
        requestAnimationFrame(update);
    }
    else if (isPaused)
    {
        surface.drawImage(resume.img, 230, 300);
        clearInterval(crateInt);
        clearInterval(zombieInt);
        clearInterval(flyingZombieInt);
        clearInterval(flyingZombieFireInt);
    }
	if(restartImg.onPlay == true)
	{
		surface.drawImage(restartImg.img, restartImg.x, restartImg.y);
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
			createMap();
		}	
	}
}

function drawHUD(surface)
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