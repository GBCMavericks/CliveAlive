var crateInt;    // Crate spawn interval.

var gameIsLost;  // Set to true when the player dies.
var gameIsWon;   // Set to true when the game is won.
var killCounter; // Counts how many zombies are killed.
var pad1 = {img:null,x:null,y:null,onPad:null}; // The two 
var pad2 = {img:null,x:null,y:null,onPad:null}; // pad classes.
var pads; // This array holds the pads that the player can jump onto.
var bullets; // This array will hold all the bullets displayed on the canvas.
var bulletSpeedMultiplier; // A variable used to determine the value of bullet speed.
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
const BULLET_SPEED_MULTIPLIER = 600 / FPS; // A vairable used to determine the value of bullet speed.
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
    //uInt = setInterval(update, 15.34);
	crateInt = setInterval(spawnCrate,20000);
    zombieInt = setInterval(spawnZombie,3000);
    update();
}

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
    for (var i = 0; i < bullets.length; i++)
    { // For each bullet in bullets array:
        surface.drawImage(bullets[i].img,bullets[i].x,bullets[i].y); // Draw the bullet on the canvas.
    }
    drawZombies(surface);
    //console.log(player);
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

function moveBullet()
{
    var currentBullet;
    for (var i = 0; i < bullets.length; i++)
    { // For each bullet in bullets array:
        currentBullet = bullets[i];
        if (currentBullet.x > canvas.width || currentBullet.x < 0 || currentBullet.y > canvas.height || currentBullet.y < 0)
        { // Then the current bullet is out of the canvas. Time to delete it from the bullets array.
            bullets.splice(i,i+1); // Removes the current bullet from the bullet array.
        }

        currentBullet.x += currentBullet.xSpeed;
        currentBullet.y += currentBullet.ySpeed;
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
		player.onPad = false;
        jumpSound.play();
    }
}

function collisionBulletZombie()
{
	for (var i = 0; i < bullets.length; i++)
    { // For all bullets in bullets array:
		for (var j = 0; j < zombies.length; j++)
		{ // For all zombies in the zombies array:
			if (bullets[i].x + bullets[i].img.width >= zombies[j].x && bullets[i].x <= zombies[j].x + zombie.img.width)
			{ // Then the x coordinates collide.
				if (bullets[i].y + bullets[i].img.height >= zombies[j].y && bullets[i].y <= zombies[j].y + zombie.img.height)
				{ // Then the y coordinates collide. We have a collision!
					zombies[j].lives--;
					bullets.splice(i,i+1);
					zombieDamageSound.load();
					zombieDamageSound.play();
					if (zombies[j].lives == 0)
					{ // If the zombie dies:
						zombies.splice(j,j+1); // Remove it from the zombies array.
						killCounter++;
						if (killCounter >= 10)
						{
							gameIsWon = true;
						}
					}
				}
			}
		}
    }
}

function collisionPlayerZombie()
{
	for (var i = 0; i < zombies.length; i++)
	{
		if (player.x + player.img.width - 12 >= zombies[i].x && player.x <= zombies[i].x + zombie.img.width - 12)
		{ // Then the x coordinates collide.
			if (player.y + player.img.height >= zombies[i].y + 12 && player.y <= zombies[i].y + zombie.img.height)
			{ // Then the y coordinates collide. We have a collision!
				gameIsLost = true;
			}
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
        if (bullets[i].y + bullets[i].img.height + bullets[i].ySpeed > ground.y)
        {
			bullets[i].y = ground.y - bullets[i].img.height;
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

function fire(event)
{
    shootSound.play(); // Play the shooting sound effect. Pew pew pew!
    var mouseX = event.clientX - surface.canvas.offsetLeft; // You have to subtract the offset value
    var mouseY = event.clientY - surface.canvas.offsetTop;  // to get the mouse coordinate inside the canvas.
    // THIS IS WHERE THE TRAJECTORY OF THE BULLET IS CALCULATED. CONTACT ME (EKIN) IF YOU HAVE ANY QUESTIONS ABOUT THIS**
    var xCoef = mouseX - player.x;
    var yCoef = mouseY - player.y;
    var commonSpeedVariable = 1/(Math.abs(xCoef)+Math.abs(yCoef));
    var finalSpeedX = commonSpeedVariable * xCoef * BULLET_SPEED_MULTIPLIER;
    var finalSpeedY = commonSpeedVariable * yCoef * BULLET_SPEED_MULTIPLIER;
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
