


//createMap();

function update()
{
	moveZombie();
	movePlayer();
	moveBullet();
	collisionBulletZombie();
	collisionPlayerZombie();
	collisionPlayerPad();
	collisionBulletPad();
	collisionBulletGround()
	playerGravity();
	render();
}

function createMap() // Initialize all the variables here.
{
	player.x = 300;
	player.y = 295;
	playerSpeed = 4;
	jumpSpeed = JUMP_SPEED;
	jumpHeight = 120;
	jumpCounter = 0;
	goingUp = true;
	currentDirection = true;
	applyPlayerGravity = false;
	fallSpeed = 5;
	zombie.img = new Image();
	zombie.img.src = "img/zombieRight.png";
	zombie.lives = 3;
	zombie.x = 100;
	zombie.y = 275 - zombie.img.height;
	zombieSpeed = 1;
	bullets = [];
	bulletSpeedMultiplier = 20;
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
	//uInt = setInterval(update, 15.34);
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
	if (gameIsLost || gameIsWon)
	{
		window.removeEventListener("keydown", onKeyDown);
		window.removeEventListener("keyup", onKeyUp);
		window.removeEventListener("keypress", onKeyPress);
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