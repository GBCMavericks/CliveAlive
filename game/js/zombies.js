// ZOMBIE RELATED VARIABLES **********************************************************************************************************
const FPS = 60;
const ZOMBIE_SPEED = 60 / FPS;
const FLYING_ZOMBIE_SPEED = 90 / FPS;
const SLIME_SPEED = 100 / FPS;
const JUMPER_ZOMBIE_SPEED = 120 / FPS;
const JUMPER_PROXIMITY_X = 200; // MAX proximity for the jumper to start jumping.
const JUMPER_PROXIMITY_Y = 100; // Same thing for the y axis.
const SLIME_PROBABILITY = 0.64;
zombieAni = setInterval(zombieAnima,1000);

var zombies = []; // The array of zombies.
var zombieDamageSound = document.createElement("audio"); // Played when the zombie takes damage.
var slime = {img:null, x:null, y:null, onPlay:null};
var slimes = [];
var flyingZombies = []; // The array of flying zombies.
var jumperZombies = []; // The array of jumper zombies.

var reinforcements = {
    zombies: null,
    flyingZombies: null,
    jumperZombies: null
};

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
		if(zombies[i].onPlay && Math.abs(player.x - zombies[i].x) > 5)
		{
			if (player.x > zombies[i].x)
			{
				zombies[i].img = zombieRight;
				zombies[i].x += ZOMBIE_SPEED;
			}
			else
			{
				zombies[i].img = zombieLeft;
				zombies[i].x -= ZOMBIE_SPEED;
			}
		}
	}
}

function spawnZombie()
{
    if(reinforcements.zombies <= 0)
    {
        clearInterval(intervals.zombie);
        return;
    }
	var currentZombie = Object.create(zombie);
    currentZombie.type = "zombie";
	currentZombie.img = zombieRight;
	if (Math.random() > 0.5)
	{
		currentZombie.x = -zombieRight.width;
	}
	else
	{
		currentZombie.x = canvas.width;
	}
	currentZombie.y = ground.y - zombieRight.height;
	currentZombie.lives = 1;
	currentZombie.onPlay = true;
	zombies.push(currentZombie);
    reinforcements.zombies--;
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
    if(reinforcements.flyingZombies <= 0)
    {
        clearInterval(intervals.flyingZombie);
        return;
    }
	var currentFlyingZombie = Object.create(flyingZombie);
	currentFlyingZombie.type = "flyingZombie";
	currentFlyingZombie.img = flyingZombieRight;
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
	currentFlyingZombie.y = canvas.height/4;
	currentFlyingZombie.lives = 1;
	currentFlyingZombie.onPlay = true;

	flyingZombies.push(currentFlyingZombie);
    reinforcements.flyingZombies--;
}

function moveFlyingZombie()
{
	for (var i = 0; i < flyingZombies.length; i++)
	{
		if (flyingZombies[i].x <= 0)
		{
			flyingZombies[i].currentDirection = true;
			flyingZombies[i].img = flyingZombieRight;
		}
		if (flyingZombies[i].x >= canvas.width - flyingZombies[i].img.width)
		{
			flyingZombies[i].currentDirection = false;
			flyingZombies[i].img = flyingZombieLeft;
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
		var randomSlime = Math.random();
		if(randomSlime< SLIME_PROBABILITY){
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
		if(slimes[i].y > ground.y){
			slimes[i].onPlay = false;
		}
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
	if(reinforcements.jumperZombies <= 0)
	{
		clearInterval(intervals.jumperZombie);
		return;
	}
	var currentJumperZombie = Object.create(jumperZombie);
	currentJumperZombie.type = "jumperZombie";
	currentJumperZombie.y = ground.y - jumperZombieRight.height;
	if (Math.random() > 0.5)
	{
		currentJumperZombie.img = jumperZombieRight;
		currentJumperZombie.x = -currentJumperZombie.img.width;
	}
	else
	{
		currentJumperZombie.img = jumperZombieLeft;
		currentJumperZombie.x = canvas.width;
	}
	currentJumperZombie.lives = 2;
	currentJumperZombie.onPlay = true;
	currentJumperZombie.verticalVelocity = 0;
	currentJumperZombie.inAir = false;
	currentJumperZombie.onPad = 0;
	jumperZombies.push(currentJumperZombie);
    reinforcements.jumperZombies--;
}

function moveJumperZombie()
{
	for (var i = 0; i < jumperZombies.length; i++)
	{
		if(jumperZombies[i].onPlay)
		{
			if (Math.abs(player.x - jumperZombies[i].x) > 5)
			{
				if (player.x > jumperZombies[i].x)
				{
					jumperZombies[i].img = jumperZombieRight;
					jumperZombies[i].x += JUMPER_ZOMBIE_SPEED;
				}
				else
				{
					jumperZombies[i].img = jumperZombieLeft;
					jumperZombies[i].x -= JUMPER_ZOMBIE_SPEED;
				}	
			}
			if (jumperZombies[i].y - player.y > JUMPER_PROXIMITY_Y && Math.abs(player.x - jumperZombies[i].x) < JUMPER_PROXIMITY_X &&!jumperZombies[i].inAir)
			{
				jumperZombies[i].verticalVelocity = JUMP_INITIAL_VELOCITY;
				jumperZombies[i].inAir = true;
				jumperZombies[i].onPad = 0;
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
			if (jumperZombies[i].inAir)
			{
				jumperZombies[i].y -= jumperZombies[i].verticalVelocity; // Move the zombie up or down according to the vertical velocity.
				jumperZombies[i].verticalVelocity -= GRAVITY; // Decelerate the zombie due to gravity.
			}
			if (jumperZombies[i].y + jumperZombies[i].img.height >= ground.y)
			{ // Then the zombie reached the ground, time to stop.
				jumperZombies[i].y = ground.y - jumperZombies[i].img.height; // Make sure the zombie does not go below ground.
				resetJumpZombie(jumperZombies[i]); // Reset the jump variables so the next jump is not screwed up.
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

function zombieAnima()
{
	var zombieAnimIndex = 0;
	if (player.x < zombies[i].x) {

        	if (zombieAnimIndex == 0)
            zombies[i].img = "img/ZombieLeft1.png";
            if (zombieAnimIndex == 1)
            zombies[i].img = "img/ZombieLeft2.png";
            if (zombieAnimIndex == 2)
            zombies[i].img = "img/ZombieLeft3.png";
            if (zombieAnimIndex == 3)
            zombies[i].img = "img/ZombieLeft4.png";
            if (zombieAnimIndex == 4)
            zombies[i].img = "img/ZombieLeft5.png";
            if (zombieAnimIndex == 5)
            zombies[i].img = "img/ZombieLeft6.png";
            if (zombieAnimIndex == 6)
            zombies[i].img = "img/ZombieLeft7.png";
            if (zombieAnimIndex == 7)
            zombies[i].img = "img/ZombieLeft8.png";
            if (zombieAnimIndex == 8)
            zombies[i].img = "img/ZombieLeft9.png";
            if (zombieAnimIndex == 9)
            zombies[i].img = "img/ZombieLeft10.png";
            if (zombieAnimIndex == 10) {
                zombieAnimIndex = 0
			}
			i++;

        }


}


