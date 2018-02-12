var canvas = document.querySelector("canvas");
canvas.width = 800;
canvas.height = 400;
const FPS = 60;

var surface = canvas.getContext("2d");
var background;  // The backgound image.
var crateInt;    // Crate spawn interval.

const GROUND_Y = 295; // The y coordinate of the ground.
var loseImage;   // This image is displayed when the player dies.
var winImage;    // This image is displayed when the player wins.
var gameIsLost;  // Set to true when the player dies.
var gameIsWon;   // Set to true when the game is won.
var pad1 = {img:null,x:null,y:null,onPad:null}; // The two 
var pad2 = {img:null,x:null,y:null,onPad:null}; // pad classes.
var pads; // This array holds the pads that the player can jump onto.
var bullets; // This array will hold all the bullets displayed on the canvas.
var bulletSpeedMultiplier; // A variable used to determine the value of bullet speed.
// PLAYER RELATED VARIABLES **********************************************************************************************************
var player = {img:null,x:null,y:null,inAir:false,verticalVelocity:0}; // The player class. img is the image of the player. x and y are the player coordinates.
const JUMP_INITIAL_VELOCITY = 600 / FPS; // The player's vertical velocity at the beginning of a jump.
const GRAVITY_MULTIPLIER = 40;
const GRAVITY = (GRAVITY_MULTIPLIER / FPS) / (FPS / 30);

const PLAYER_SPEED = 240 / FPS;

const ZOMBIE_SPEED = 60 / FPS;
const BULLET_SPEED_MULTIPLIER = 1200 / FPS; // A vairable used to determine the value of bullet speed.
var currentDirection;// Used to keep track of player's direction. (true=right false=left)
var jumpSound = document.createElement("AUDIO"); // This is the jump sound effect, weeeeeeeee!
var shootSound = document.createElement("AUDIO"); // Shooting sound effect.
// END OF PLAYER RELATED VARIABLES ***************************************************************************************************

// ZOMBIE RELATED VARIABLES **********************************************************************************************************
var zombie = {img:null,lives:null,x:null,y:null};
var zombieSpeed; // Speed of zombie in pixels.
var zombieDamageSound = document.createElement("AUDIO"); // Played when tthe zombie takes damage.
// END OF ZONBIE RELATED VARIABLES ***************************************************************************************************

// PICKUP RELATED VARIABLES **********************************************************************************************************
var crate = 
{
	img:null, // Image of the crate.
	x:null, // X-coordinate of the crate.
	y:null, // Y-coordinate of the crate.
	onGround:null, // True: crate is on the ground. False: crate is nit on the ground.
	speed:null, // Vertical speed of the crate in pixels.
	onPad:null, // True: crate is on a pad. False: crate is not on a pad.
	hide:null // True: hide the crate image. False: render the crate image.
}; 
var crateCounter; // Spawn timer of the crate.
var crateSound = document.createElement("AUDIO");
// END OF PICKUP RELATED VARIABLES ***************************************************************************************************

var leftPressed = false; // These flags are used  
var rightPressed = false;// to keep track of which
var upPressed = false;   // keyboard button the
var downPressed = false; // player presses.

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
canvas.addEventListener("click", fire);


function initFiles(){
	player.img = new Image();
	player.img.src = "img/playerRight.png";
	jumpSound.setAttribute("src","aud/jump.wav");
	shootSound.setAttribute("src","aud/shoot.wav");
	zombieDamageSound.setAttribute("src","aud/damage.wav");
}

initFiles();



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
    background = new Image();
    background.src = "img/background.jpg";
    loseImage = new Image();
    loseImage.src = "img/lose.png";
    winImage = new Image();
    winImage.src = "img/win.png";
    player.img = new Image();
    player.img.src = "img/playerRight.png";
    jumpSound.setAttribute("src","aud/jump.wav");
    shootSound.setAttribute("src","aud/shoot.wav");
    zombieDamageSound.setAttribute("src","aud/damage.wav");
	crateSound.setAttribute("src","aud/pickup.wav");
    player.x = 300;
    player.y = 295;
	player.currentPowerUp = 0;
	crate.img = new Image();
	crate.img.src = "img/crate.png";
	crate.x = 20;
	crate.y = 20;
	crate.speed = 2;
	crate.onGround = false;
	crate.onPad = false;
	crate.hide = false;
    currentDirection = true;
    zombie.img = new Image();
    zombie.img.src = "img/zombieRight.png";
    zombie.lives = 3;
    zombie.x = 100;
    zombie.y = 275 - zombie.img.height;
    bullets = [];
    pads = [];
    pad1.img = new Image();
    pad1.img.src = "img/pad.png";
    pad1.x = 100;
    pad1.y = 250;
    pad1.onPad = false;
    pads.push(pad1);
    pad2.img = new Image();
    pad2.img.src = "img/pad.png";
    pad2.x = 450;
    pad2.y = 250;
    pad2.onPad = false;
    pads.push(pad2);
    gameIsLost = false;
    gameIsWon = false;
    // Start the game
    update();
	crateInt = setInterval(spawnCrate,3000);
}

function render()
{
    surface.clearRect(0,0,canvas.width,canvas.height); // Clear the canvas first.
    surface.drawImage(background,0,0); // Draw the background.
    for (var i = 0; i < pads.length; i++)
    { // For each pad in the pads array, draw it on the canvas.
        surface.drawImage(pads[i].img,pads[i].x,pads[i].y);
    }
    for (var i = 0; i < bullets.length; i++)
    { // For each bullet in bullets array:
        surface.drawImage(bullets[i].img,bullets[i].x,bullets[i].y); // Draw the bullet on the canvas.
    }
    if (!gameIsWon)
    {
        surface.drawImage(zombie.img,zombie.x,zombie.y); // Draw the zombie.
    }
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
            surface.drawImage(loseImage,200,100); // Draw the player.
        }
        if (gameIsWon)
        {
            surface.drawImage(winImage,200,100); // Draw the player.
        }
        clearInterval(uInt);
    }
}

function moveBullet()
{
    var currentBullet;
    for (var i = 0; i < bullets.length; i++)
    { // For each bullet in bullets array:
        currentBullet = bullets[i];
        if (currentBullet.x > canvas.width || currentBullet.x < 0 || currentBullet.y > canvas.height || currentBullet.y < 0)
        { // Then the current bulletis out of the canvas. Time to delete it from the bullets array.
            bullets.splice(i,i+1); // Removes the current bullet from the bullet array.
        }

        currentBullet.x += currentBullet.xSpeed;
        currentBullet.y += currentBullet.ySpeed;
    }
}

function moveZombie()
{
    if (player.x > zombie.x)
    {
        zombie.img.src = "img/zombieRight.png";
        zombie.x += ZOMBIE_SPEED;
    }
    else
    {
        zombie.img.src = "img/zombieLeft.png";
        zombie.x -= ZOMBIE_SPEED;
    }
}

function moveCrate()
{
	if (!crate.onGround || !crate.onPad)
	{
		crate.y += crate.speed;
	}
}

function collisionCrateGround()
{
	if (crate.y - crate.img.height >= GROUND_Y)
	{
		crate.onGround = true;
		crate.onPad = false;
		crate.y = GROUND_Y + crate.img.height;
	}
}

function collisionCratePad()
{
	for ( var i = 0; i < pads.length; i++)
    { // For each pad in the pads array:
		if (crate.y + crate.img.height <= pads[i].y + pads[i].img.height - crate.speed && crate.y + crate.img.height >= pads[i].y + crate.speed)
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
				player.currentPowerUp = 1;
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
        jumpSound.play();
    }
}

function collisionBulletZombie()
{
    for (var i = 0; i < bullets.length; i++)
    { // For all bullets in bullets array:
        if (bullets[i].x + bullets[i].img.width >= zombie.x && bullets[i].x <= zombie.x + zombie.img.width)
        { // Then the x coordinates collide.
            if (bullets[i].y + bullets[i].img.height >= zombie.y && bullets[i].y <= zombie.y + zombie.img.height)
            { // Then the y coordinates collide. We have a collision!
                zombie.lives--;
                bullets.splice(i,i+1);
                zombieDamageSound.load();
                zombieDamageSound.play();
                if (zombie.lives == 0)
                {
                    gameIsWon = true;
                }
            }
        }
    }
}

function collisionPlayerZombie()
{
    if (player.x + player.img.width - 12 >= zombie.x && player.x <= zombie.x + zombie.img.width - 12)
    { // Then the x coordinates collide.
        if (player.y + player.img.height >= zombie.y + 12 && player.y <= zombie.y + zombie.img.height)
        { // Then the y coordinates collide. We have a collision!
            gameIsLost = true;
        }
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
                pads[i].onPad = false;
            }
        }
    }
}

function collisionBulletPad()
{
    for (var i = 0; i < bullets.length; i++)
    { // For each bullet in the bullets array:
        for (var j = 0; j < pads.length; j++)
        { // For each pad in the pads array:
            var leftCollide = false, rightCollide = false, upCollide = false, downCollide = false;
            if (bullets[i].x + bullets[i].img.width + bullets[i].xSpeed >= pads[j].x)
            { // IMPORTANT: Adding the speed of the bullet to these four if statements is crucial! It prevents the bullet from going inside the pad.
                leftCollide = true;
            }
            if (bullets[i].x  + bullets[i].xSpeed <= pads[j].x + pads[j].img.width)
            {
                rightCollide = true;
            }
            if (bullets[i].y + bullets[i].img.height + bullets[i].ySpeed>= pads[j].y)
            {
                upCollide = true;
            }
            if (bullets[i].y + bullets[i].ySpeed<= pads[j].y + pads[j].img.height)
            {
                downCollide = true;
            }
            if (leftCollide && rightCollide && upCollide && downCollide)
            {// Collision occured!
                var bulletCenterY = bullets[i].y + bullets[i].img.height/2;
                if ( bulletCenterY > pads[j].y && bulletCenterY < pads[j].y + pads[j].img.height)
                { // Then a horizontal collision occured.
                    if (bullets[i].x < pads[j].x)
                    { // Then the bullet collided with the left side.
                        bullets[i].x = pads[j].x - bullets[i].img.width; // This ensures the bullet ricochet animation is smooth.
                    }
                    else
                    { // Then the bullet collided with the right side.
                        bullets[i].x = pads[j].x + pads[j].img.width; // This ensures the bullet ricochet animation is smooth.
                    }
                    bullets[i].xSpeed = -bullets[i].xSpeed;
                }
                else
                { // Then a vertical collision occured.
                    if (bullets[i].y < pads[j].y)
                    { // Then the bullet collided with the top side.
                        bullets[i].y = pads[j].y - bullets[i].img.height; // This ensures the bullet ricochet animation is smooth.
                    }
                    else
                    { // Then the bullet collided with the bottom side.
                        bullets[i].y = pads[j].y + pads[j].img.height; // This ensures the bullet ricochet animation is smooth.
                    }
                    bullets[i].ySpeed = -bullets[i].ySpeed;
                }
            }
        }
    }
}

function collisionBulletGround()
{
    for (var i = 0; i < bullets.length; i++)
    {
        if (bullets[i].y + bullets[i].img.height + bullets[i].ySpeed > 355)
        {
            bullets[i].ySpeed = -bullets[i].ySpeed;
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
    if (player.y >= 295)
    { // Then the player reached the ground, time to stop.
        player.y = 295; // Make sure the player does not go below ground.
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

function fire(event)
{
    shootSound.play(); // Play the shooting sound effect. Pew pew pew!
    var mouseX = event.clientX - surface.canvas.offsetLeft; // You have to subtract the offset value
    var mouseY = event.clientY - surface.canvas.offsetTop;  // to get the mouse coordinate inside the canvas.
    // THIS IS WHERE THE TRAJECTORY OF THE BULLET IS CALCULATED. CONTACT ME (EKIN) IF YOU HAVE ANY QUESTIONS ABOUT THIS**
    var xCoef = mouseX - player.x;
    var yCoef = mouseY - player.y;
    var commonSpeedVariable = 1/(Math.abs(xCoef)+Math.abs(yCoef));
    var finalSpeedX = commonSpeedVariable*xCoef*BULLET_SPEED_MULTIPLIER;
    var finalSpeedY = commonSpeedVariable*yCoef*BULLET_SPEED_MULTIPLIER;
    // END OF BULLET TRAJECTORY CALCULATION *****************************************************************************
    var bulletImage = new Image();
    bulletImage.src = "img/bullet.png";
    bullets.push({img:bulletImage,x:player.x,y:player.y,xSpeed:finalSpeedX,ySpeed:finalSpeedY});
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
