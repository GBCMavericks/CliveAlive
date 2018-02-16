
// ZOMBIE RELATED VARIABLES **********************************************************************************************************
const FPS = 60;
const ZOMBIE_SPEED = 60 / FPS;

var zombies = []; // The array of zombies.
var zombie = {img:null,lives:null,x:null,y:null}
var zombieDamageSound = document.createElement("AUDIO"); // Played when the zombie takes damage.
var flyingZombie = {img:null, lives:null, x:null, y:null, onPlay:null} // Flying zombies variable
var flyingZombies = []; // The array of flying zombies.
// END OF ZONBIE RELATED VARIABLES ***************************************************************************************************

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
	currentFlyingZombie.img.src = "img/flyingZombieLeft.png";
	currentFlyingZombie.x = 0;
	currentFlyingZombie.y = 0;
	currentFlyingZombie.lives = 1;
	currentFlyingZombie.onPlay = true;
	flyingZombies.push(currentFlyingZombie);
}

function drawFlyingZombies(surface)
{
	for (var i = 0; i < flyingZombies.length; i++) // Draw the flying zombies.
	{
		if(flyingZombies[i].onPlay)
			surface.drawImage(flyingZombies[i].img, flyingZombies[i].x, flyingZombies[i].y);
	}
}