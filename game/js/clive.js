
var pad1 = {img:null,x:null,y:null,onPad:null}; // The two 
var pad2 = {img:null,x:null,y:null,onPad:null}; // pad classes.
var pads; // This array holds the pads that the player can jump onto.
var bullets; // This array will hold all the bullets displayed on the canvas.
var bulletSpeedMultiplier; // A vairable used to determine the value of bullet speed.

// PLAYER RELATED VARIABLES **********************************************************************************************************
var player = {img:null,x:null,y:null}; // The player class. img is the image of the player. x and y are the player coordinates.
var playerSpeed; // Player's speed in pixels.
const JUMP_SPEED = 8; // Used to set the jump speed back to it's original value.
var jumpSpeed;   // Player's current jump speed in pixels.
var jumpHeight;  // Player's jump height in pixels.
var jumpCounter; // Trackshow many pixels the player jumped so far.
var goingUp;     // Flag for the jumping animation. True means jumping up, false means falling down.
var flag1 = true;  //  These flags are used to make sure
var flag2 = false; //  the jump speed is modified once,
var flag3 = false; //  and not more.
var currentDirection;// Used to keep track of player's direction. (true=right false=left)
var applyPlayerGravity; // True: Start applying gravitational force to player.   False: Stop applying gravitational force to player.
var fallSpeed; // Player fall speed in pixels.
var jumpSound = document.createElement("AUDIO"); // This is the jump sound effect, weeeeeeeee!
var shootSound = document.createElement("AUDIO"); // Shooting sound effect.
// END OF PLAYER RELATED VARIABLES ***************************************************************************************************

// ZOMBIE RELATED VARIABLES **********************************************************************************************************
var zombie = {img:null,lives:null,x:null,y:null}
var zombieSpeed; // Speed of zombiein pixels.
var zombieDamageSound = document.createElement("AUDIO"); // Played when tthe zombie takes damage.
// END OF ZONBIE RELATED VARIABLES ***************************************************************************************************

var leftPressed = false; // These flags are used  
var rightPressed = false;// to keep track of which
var upPressed = false;   // keyboard button the
var downPressed = false; // player presses.



window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.addEventListener("keypress", onKeyPress);
canvas.addEventListener("click", fire);


function initFiles(){
	player.img = new Image();
	player.img.src = "img/playerRight.png";
	jumpSound.setAttribute("src","aud/jump.wav");
	shootSound.setAttribute("src","aud/shoot.wav");
	zombieDamageSound.setAttribute("src","aud/damage.wav");
}

initFiles();




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
		zombie.x += zombieSpeed;
	}
	else
	{
		zombie.img.src = "img/zombieLeft.png";
		zombie.x -= zombieSpeed;
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
		player.x = player.x - playerSpeed;
		currentDirection = false;
	}
	if (rightPressed && player.x < (canvas.width - player.img.width))
	{
		if (upPressed)
			player.img.src = "img/playerRightJump.png";
		else
			player.img.src = "img/playerRight.png";
		player.x = player.x + playerSpeed;
		currentDirection = true;
	}
	if (upPressed)
	{
		window.removeEventListener("keypress", onKeyPress); // Remove the event listener so the player can't jump mid air.
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
		if (goingUp)
		{
			player.y = player.y - jumpSpeed;
			jumpCounter += jumpSpeed;
			if (jumpCounter >= jumpHeight/100*50 && flag1) // When the player reaches half of his/her jump, reduce the jump speed.
			{
				jumpSound.play(); // Plays the jump sound effect.
				jumpSpeed = JUMP_SPEED - 1;
				flag1 = false;
				flag2 = true;
			}
			else if (jumpCounter >= jumpHeight/100*75 && flag2) // When %75 of jump height reached, decrease the jump speed even more.
			{
				jumpSpeed = JUMP_SPEED - 2;
				flag2 = false;
				flag3 = true;
			}
			else if (jumpCounter >= jumpHeight/100*95 && flag3) // When &95 of jump height reached, set jumpSpeed to 1. This creates a "floating effect". 
			{
				jumpSpeed = 1;
				flag3 = false;
			}
			if (jumpCounter >= jumpHeight) 
			{ // Reached the peak of jump.
				goingUp = false; // Set the flag so that the falling animation can begin.
				flag1 = true;
			}
		}
		else
		{ // Reached the peak of jump, now it's time to fall.
			applyPlayerGravity = true;
			window.addEventListener("keypress", onKeyPress);
		}
	}
}


function playerGravity()
{
	if (applyPlayerGravity)
	{
		window.removeEventListener("keypress", onKeyPress); // We don't want the player to be able to jump mid-air (for now).
		player.y += fallSpeed;
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
				applyPlayerGravity = false; // Stop applying gravitational force.
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
			applyPlayerGravity = false; // Make sure the player is exactly on the pad.
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

function resetJump()
{
	jumpSpeed = JUMP_SPEED;
	jumpHeight = 120;
	jumpCounter = 0;
	goingUp = true;
	upPressed = false;
	flag1 = true;
	flag2 = false;
	flag3 = false;
	window.addEventListener("keypress", onKeyPress);
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
	var finalSpeedX = commonSpeedVariable*xCoef*bulletSpeedMultiplier;
	var finalSpeedY = commonSpeedVariable*yCoef*bulletSpeedMultiplier;
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
	}
}

function onKeyPress(event)
{
	if (event.keyCode == 87 || event.keyCode == 119)
	{
		upPressed = true;
	}
}