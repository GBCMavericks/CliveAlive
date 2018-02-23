var gameIsLost;  // Set to true when the player dies.
var gameIsWon;   // Set to true when the game is won.
var killCounter; // Counts how many zombies are killed.
var pad1 = {img:null,x:null,y:null,onPad:null}; // The two 
var pad2 = {img:null,x:null,y:null,onPad:null}; // pad classes.
var pads; // This array holds the pads that the player can jump onto.
var bullets; // This array will hold all the bullets displayed on the canvas.
var bulletSpeedMultiplier; // A variable used to determine the value of bullet speed.

// INTERVALS ************************************************************************************************************************
var crateInt;    // Crate spawn interval.
var flyingZombieInt; // Flying zombie spawn interval.
var flyingZombieFireInt; // Flying zombie fire (slime ball) interval.
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
const BULLET_SPEED_MULTIPLIER = 600 / FPS; // A variable used to determine the value of bullet speed.
var currentDirection;// Used to keep track of player's direction. (true=right false=left)
var jumpSound = document.createElement("AUDIO"); // This is the jump sound effect, weeeeeeeee!
var shootSound = document.createElement("AUDIO"); // Shooting sound effect.
// END OF PLAYER RELATED VARIABLES ***************************************************************************************************

// PICKUP RELATED VARIABLES **********************************************************************************************************
var crate = 
{
	img:null, // Image of the crate.
	x:null, // X-coordinate of the crate.
	y:null, // Y-coordinate of the crate.
	onGround:null, // True: crate is on the ground. False: crate is nit on the ground.
	onPad:null, // True: crate is on a pad. False: crate is not on a pad.
	hide:null // True: hide the crate image. False: render the crate image.
};  
const CRATE_SPEED = 120 / FPS;
var crateCounter; // Spawn timer of the crate.
var crateSound = document.createElement("AUDIO");
var currentPowerUp = 0; // 0: normal, 1: spray
var powerUpAmmo; // Number of uses of the power-up
// END OF PICKUP RELATED VARIABLES ***************************************************************************************************

var leftPressed = false; // These flags are used  
var rightPressed = false;// to keep track of which
var upPressed = false;   // keyboard button the
var downPressed = false; // player presses.


function update()
{
    moveZombie();
    movePlayer();
    moveBullet();
	moveCrate();
	collisionCrateGround();
	collisionCratePad();
	collisionCratePlayer();
    collisionBulletZombie();
    collisionPlayerZombie();
    collisionPlayerPad();
    collisionBulletPad();
    collisionBulletGround();
    playerGravity();
    render();
    requestAnimationFrame(update);
}

function createMap() // Initialize all the variables here.
{ 
	background.x = 0;
	background.y = 0;
	ground.offset = 20;
	ground.x = 0;
	ground.y = background.img.height - ground.img.height + ground.offset;
    player.x = 300;
    player.y = ground.y - player.img.height;
	player.onPad = false;
	player.currentPowerUp = 0;
	crate.x = Math.random() * (canvas.width - crate.img.width);;
	crate.y = -crate.img.height;
	crate.onGround = false;
	crate.onPad = false;
	crate.hide = false;
    currentDirection = true;
	zombies = [];
    zombie.lives = 3;
    zombie.x = -zombie.img.width;
    zombie.y = ground.y - zombie.img.height;
    bullets = [];
    bulletSpeedMultiplier = 10;
    pads = [];
    pad1.x = 100;
    pad1.y = 250;
    pad1.onPad = false;
    pads.push(pad1);
    pad2.x = 450;
    pad2.y = 250;
    pad2.onPad = false;
    pads.push(pad2);
    gameIsLost = false;
    gameIsWon = false;
	killCounter = 0;
	jumpSound.setAttribute("src","aud/jump.wav");
    shootSound.setAttribute("src","aud/shoot.wav");
    zombieDamageSound.setAttribute("src","aud/damage.wav");
	crateSound.setAttribute("src","aud/pickup.wav");
	crateInt = setInterval(spawnCrate,20000);
    zombieInt = setInterval(spawnZombie,3000);
	flyingZombieInt = setInterval(spawnFlyingZombie, 3000);
	flyingZombieFireInt = setInterval(fireFlyingZombie, 2500);
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
    playerGravity();
    render();
    cleanZombieArray();
	cleanFlyingZombieArray();
    cleanBulletArray();
	cleanSlimesArray();
}


function render()
{
    surface.clearRect(0,0,canvas.width,canvas.height); // Clear the canvas first.
    surface.drawImage(background.img, background.x, background.y); // Draw the background.
	surface.drawImage(ground.img, ground.x, ground.y); // Draw the ground.
    for (var i = 0; i < pads.length; i++)
    { // For each pad in the pads array, draw it on the canvas.
        surface.drawImage(pads[i].img,pads[i].x,pads[i].y);
    }
    drawBullets(surface);
    drawZombies(surface);
	drawFlyingZombies(surface);
	drawSlimes(surface);
    surface.drawImage(player.img,player.x,player.y); // Draw the player.
	if (!crate.hide)
	{
		surface.drawImage(crate.img,crate.x,crate.y); // Draw the crate.
	}
    if (gameIsLost || gameIsWon)
    {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        canvas.removeEventListener("click", fire);
        if (gameIsLost)
        {
            surface.drawImage(loseImage,200,100); 
        }
        if (gameIsWon)
        {
            surface.drawImage(winImage,200,100);
        }
        //clearInterval(uInt);
		clearInterval(crateInt);
		clearInterval(zombieInt);
    }
    else{
        requestAnimationFrame(update);
    }
}

function moveCrate()
{
	if (!crate.onGround || !crate.onPad)
	{
		crate.y += CRATE_SPEED;
	}
}

function collisionCrateGround()
{
	if (crate.y + crate.img.height >= ground.y)
	{
		crate.onGround = true;
		crate.onPad = false;
		crate.y = ground.y - crate.img.height;
	}
}

function collisionCratePad()
{
	for ( var i = 0; i < pads.length; i++)
    { // For each pad in the pads array:
		if (crate.y + crate.img.height <= pads[i].y + pads[i].img.height - CRATE_SPEED && crate.y + crate.img.height >= pads[i].y + CRATE_SPEED)
		{ // Then there is a collision between the y coordinates of the crate and the pad.
			if (crate.x + crate.img.width >= pads[i].x && crate.x <= pads[i].x + pads[i].img.width)
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
		if (player.x + player.img.width >= crate.x && player.x <= crate.x + crate.img.width)
		{ // Then the x coordinates collide.
			if (player.y + player.img.height >= crate.y && player.y <= crate.y + crate.img.height)
			{ // Then the y coordinates collide. We have a collision!
				currentPowerUp = 1;
				powerUpAmmo = 5;
				crate.hide = true;
				crateSound.play();
			}
		}
	}
}

function spawnCrate()
{
	crate.x = Math.random() * (canvas.width - crate.img.width);
	crate.y = -crate.img.height;
	crate.onGround = false;
	crate.onPad = false;
	crate.hide = false;
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
