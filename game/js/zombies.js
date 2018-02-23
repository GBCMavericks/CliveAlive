// ZOMBIE RELATED VARIABLES **********************************************************************************************************
const FPS = 60;
const ZOMBIE_SPEED = 60 / FPS;
const FLYING_ZOMBIE_SPEED = 90 / FPS
const SLIME_SPEED = 100 / FPS

var zombies = []; // The array of zombies.
var zombie = {img:null,lives:null,x:null,y:null}
var zombieDamageSound = document.createElement("AUDIO"); // Played when the zombie takes damage.
var flyingZombie = // Flying Zombie 
{
	img:null,  // The image of the flying zombie.
	lives:null, // Number of lives.
	x:null,   // X-coordinate of the flying zombie.
	y:null, // Y-coordinate of the flying zombie.
	onPlay:null, // True = draw the flying zombie. False = do not draw the flying zombie.
	currentDirection:null // True = Zombie is going right. False = Zombie is going left.
}
var slime = {img:null, x:null, y:null, onPlay:null};
var slimes = [];
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
	currentFlyingZombie.y = 0;
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