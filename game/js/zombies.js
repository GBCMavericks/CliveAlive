// ZOMBIE RELATED VARIABLES **********************************************************************************************************
const FPS = 60;
const ZOMBIE_SPEED = 60 / FPS;
const FLYING_ZOMBIE_SPEED = 90 / FPS;
const SLIME_SPEED = 100 / FPS;
const JUMPER_ZOMBIE_SPEED = 120 / FPS;

var zombies = []; // The array of zombies.
var zombieDamageSound = document.createElement("AUDIO"); // Played when the zombie takes damage.
var slime = {img:null, x:null, y:null, onPlay:null};
var slimes = [];
var flyingZombies = []; // The array of flying zombies.
var jumperZombies = []; // The array of jumper zombies.
// END OF ZOMBIE RELATED VARIABLES ***************************************************************************************************

function drawZombies(surface)
{
	for (var i = 0; i < zombies.length; i++) // Draw the zombies.
	{
		if(zombies[i].onPlay)
			surface.drawImage(zombies[i].img, zombies[i].x, zombies[i].y);
	}
}

function moveZombie()
{
	for (var i = 0; i < zombies.length; i++)
	{
		if(zombies[i].onPlay)
		{
			if (player.x > zombies[i].x)
			{
				zombies[i].img.src = "img/zombieRight.png";
				zombies[i].x += ZOMBIE_SPEED;
			}
			else
			{
				zombies[i].img.src = "img/zombieLeft.png";
				zombies[i].x -= ZOMBIE_SPEED;
			}	
		}
	}
}

function spawnZombie()
{
	var currentZombie = Object.create(zombie);
	currentZombie.img = new Image();
	currentZombie.img.src = "img/zombieRight.png";
	if (Math.random() > 0.5)
	{
		currentZombie.x = -zombie.img.width;
	}
	else
	{
		currentZombie.x = background.img.width;
	}
	currentZombie.y = ground.y - zombie.img.height;
	currentZombie.lives = 1;
	currentZombie.onPlay = true;
	zombies.push(currentZombie);
}

function cleanZombieArray()
{
	var newZombies = [];
	for (var i = 0; i < zombies.length; i++)
	{
		if(zombies[i].onPlay)
		{
			newZombies.push(zombies[i]);
		}
	}
	zombies = newZombies;
}

function spawnFlyingZombie()
{
	var currentFlyingZombie = Object.create(flyingZombie);
	currentFlyingZombie.img = new Image();
	currentFlyingZombie.img.src = "img/flyingZombieRight.png";
	if (Math.random() > 0.5)
	{
		currentFlyingZombie.x = -currentFlyingZombie.img.width;
		currentFlyingZombie.currentDirection = true;
	}
	else
	{
		currentFlyingZombie.x = canvas.width;
		currentFlyingZombie.currentDirection = false;
	}
	currentFlyingZombie.y = canvas.height/5;
	currentFlyingZombie.lives = 1;
	currentFlyingZombie.onPlay = true;
	flyingZombies.push(currentFlyingZombie);
}

function moveFlyingZombie()
{
	for (var i = 0; i < flyingZombies.length; i++)
	{
		if (flyingZombies[i].x <= 0)
		{
			flyingZombies[i].currentDirection = true;
			flyingZombies[i].img.src = "img/flyingZombieRight.png";
		}
		if (flyingZombies[i].x >= canvas.width - flyingZombies[i].img.width)
		{
			flyingZombies[i].currentDirection = false;
			flyingZombies[i].img.src = "img/flyingZombieLeft.png";
		}
		if (flyingZombies[i].currentDirection)
		{
			flyingZombies[i].x += FLYING_ZOMBIE_SPEED;
		}
		else
		{
			flyingZombies[i].x -= FLYING_ZOMBIE_SPEED;
		}
	}
}

function drawFlyingZombies(surface)
{
	for (var i = 0; i < flyingZombies.length; i++) // Draw the flying zombies.
	{
		if(flyingZombies[i].onPlay)
			surface.drawImage(flyingZombies[i].img, flyingZombies[i].x, flyingZombies[i].y);
	}
}

function cleanFlyingZombieArray()
{
	var newFlyingZombies = [];
	for (var i = 0; i < flyingZombies.length; i++)
	{
		if(flyingZombies[i].onPlay)
		{
			newFlyingZombies.push(flyingZombies[i]);
		}
	}
	flyingZombies = newFlyingZombies;
}

function fireFlyingZombie()
{
	for (var i = 0; i < flyingZombies.length; i++)
	{
		var slimeImage = new Image();
		slimeImage.src = "img/slime.png";
		slimes.push(
            {
                img: slimeImage,
                x: flyingZombies[i].x + flyingZombies[i].img.width / 2,
                y: flyingZombies[i].y + flyingZombies[i].img.height / 2,
                xSpeed: 0,
                ySpeed: SLIME_SPEED,
                onPlay: true,
            });
	}
}

function drawSlimes(surface)
{
    for (var i = 0; i < slimes.length; i++)
    { 
        if(slimes[i].onPlay)
            surface.drawImage(slimes[i].img,slimes[i].x,slimes[i].y);
    }
}

function cleanSlimesArray()
{
	var newSlimes = [];
	for (var i = 0; i < slimes.length; i++)
	{
		if(slimes[i].onPlay)
		{
			newSlimes.push(slimes[i]);
		}
	}
	slimes = newSlimes;
}

function moveSlime()
{
	for (var i = 0; i < slimes.length; i++)
	{
		slimes[i].y += SLIME_SPEED;
	}
}

function drawJumperZombies(surface)
{
    for (var i = 0; i < jumperZombies.length; i++)
    { 
        if(jumperZombies[i].onPlay)
            surface.drawImage(jumperZombies[i].img,jumperZombies[i].x,jumperZombies[i].y);
    }
}

function spawnJumperZombie()
{
	var currentJumperZombie = Object.create(jumperZombie);
	currentJumperZombie.y = ground.y - jumperZombie.img.height;
	currentJumperZombie.img = new Image();
	if (Math.random() > 0.5)
	{
		currentJumperZombie.x = -currentJumperZombie.img.width;
		currentJumperZombie.img.src = "img/jumperRight.png";
	}
	else
	{
		currentJumperZombie.x = background.img.width;
		currentJumperZombie.img.src = "img/jumperLeft.png";
	}
	currentJumperZombie.lives = 2;
	currentJumperZombie.onPlay = true;
	currentJumperZombie.verticalVelocity = 0;
	currentJumperZombie.inAir = false;
	currentJumperZombie.onPad = false;
	jumperZombies.push(currentJumperZombie);
}

function moveJumperZombie()
{
	for (var i = 0; i < jumperZombies.length; i++)
	{
		if(jumperZombies[i].onPlay)
		{
			if (player.x > jumperZombies[i].x)
			{
				jumperZombies[i].img.src = "img/jumperRight.png";
				jumperZombies[i].x += JUMPER_ZOMBIE_SPEED;
			}
			else
			{
				jumperZombies[i].img.src = "img/jumperLeft.png";
				jumperZombies[i].x -= JUMPER_ZOMBIE_SPEED;
			}	
			if (player.y < jumperZombies[i].y && !jumperZombies[i].inAir)
			{
				for (var j = 0; j < pads.length; j++)
				{
					pads[j].onPadZombie = false; // Player is NOT on any of the pads while jumping.
				}
				jumperZombies[i].verticalVelocity = JUMP_INITIAL_VELOCITY;
				jumperZombies[i].inAir = true;
				jumperZombies[i].onPad = false;
			}
		}
	}
}

function zombieGravity()
{
	for (var i = 0; i < jumperZombies.length; i++)
	{
		if (typeof jumperZombies[i] != 'undefined')
		{
			jumperZombies[i].y -= jumperZombies[i].verticalVelocity; // Move the zombie up or down according to the vertical velocity.
			jumperZombies[i].verticalVelocity -= GRAVITY; // Decelerate the zombie due to gravity.
			/*if(currentDirection)
			{
				player.img.src = "img/playerRightJump.png";
			}
			else
			{
				player.img.src = "img/playerLeftJump.png";
			}*/
			for (var j = 0; j < pads.length; j++)
			{ // For all the pads in the pads array:
				if (pads[j].onPadZombie)
				{ // Then the zombie landed on one of the pads.
					jumperZombies[i].y = pads[j].y - jumperZombies[i].img.height; // Make sure the zombie is exactly on the pad.
					resetJumpZombie(jumperZombies[i]); // Reset the jump variables so the next jump is not screwed up.
					/*if(currentDirection)
					{
						player.img.src = "img/playerRight.png";
					}
					else
					{
						player.img.src = "img/playerLeft.png";
					}*/
				}
			}
			if (jumperZombies[i].y + jumperZombies[i].img.height >= ground.y)
			{ // Then the zombie reached the ground, time to stop.
				jumperZombies[i].y = ground.y - jumperZombies[i].img.height; // Make sure the zombie does not go below ground.
				resetJumpZombie(jumperZombies[i]); // Reset the jump variables so the next jump is not screwed up.
				/*if(currentDirection)
				{
					player.img.src = "img/playerRight.png";
				}
				else
				{
					player.img.src = "img/playerLeft.png";
				}*/
			}
		}
	}
}

function cleanJumperZombieArray()
{
	var newJumpers = [];
	for (var i = 0; i < jumperZombies.length; i++)
	{
		if(jumperZombies[i].onPlay)
		{
			newJumpers.push(jumperZombies[i]);
		}
	}
	jumperZombies = newJumpers;
}