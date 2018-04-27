function collisionCrateGround()
{
	if (crate.y + crateImage.height >= ground.y)
	{
		crate.onGround = true;
		crate.onPad = false;
		crate.y = ground.y - crateImage.height;
	}
}

function collisionCratePlayer()
{
	if (!crate.hide)
	{
        if (player.x + player.width >= crate.x 
            && player.x <= crate.x + crateImage.width)
		{ // Then the x coordinates collide.
            if (player.y + player.height >= crate.y 
                && player.y <= crate.y + crateImage.height)
			{ // Then the y coordinates collide. We have a collision!
				player.currentPowerUp = Math.floor((Math.random() * 2) + 1);
				console.log(player.currentPowerUp);
				powerUpAmmo = POWERUP_USES;
				crate.hide = true;
				crateSound.play();
			}
		}
	}
}
function removeInvulnerability(){
	console.log('Is this executed too fast?' + player.livesLeft);
	player.invulnerable = false;
}

function collisionPlayerZombie()
{
	for (var i = 0; i < zombies.length; i++)
	{
		if(zombies[i].onPlay && zombies[i].animationState != 2)
		{
			if (player.x + player.img.width - 12 >= zombies[i].x 
				&& player.x <= zombies[i].x + zombieRightWalk[zombies[i].animationWalkIndex].width - 12)
			{ // Then the x coordinates collide.
				if (player.y + player.img.height >= zombies[i].y + 12 
					&& player.y <= zombies[i].y + zombieRightWalk[zombies[i].animationWalkIndex].height)
				{ // Then the y coordinates collide. We have a collision!
					console.log('checking player vulnerability' + player.invulnerable);

					if(!player.invulnerable){
						player.livesLeft--;
						console.log('how many times the player dies?' + player.livesLeft);
						if (player.livesLeft == 0){
							gameIsLost = true;
						}
						else{
							console.log('Is this even executed?' + player.livesLeft);
							player.invulnerable = true;
							setTimeout(removeInvulnerability, 2000);
						}
					}
				}
			}	
		}
	}
}

function collisionGroundZombie()
{
	for (var i = 0; i < zombies.length; i++)
	{
		var currentImage;
		if (zombies[i].direction)
		{
			if (zombies[i].animationState == 0)
				currentImage = zombieRightIdle[zombies[i].animationIdleIndex];
			else if (zombies[i].animationState == 1)
				currentImage = zombieRightWalk[zombies[i].animationWalkIndex];
			else if (zombies[i].animationState == 2)
				currentImage = zombieRightDead[zombies[i].animationDeadIndex];
		}
		else
		{
			if (zombies[i].animationState == 0)
				currentImage = zombieLeftIdle[zombies[i].animationIdleIndex];
			else if (zombies[i].animationState == 1)
				currentImage = zombieLeftWalk[zombies[i].animationWalkIndex];
			else if (zombies[i].animationState == 2)
				currentImage = zombieLeftDead[zombies[i].animationDeadIndex];
		}
		zombies[i].y = ground.y - currentImage.height;
	}
}

function collisionBulletZombie()
{
	for (var j = 0; j < zombies.length; j++)
	{ // For all zombies in the zombies array:
		if (zombies[j].animationState != 2)
		{
			for (var i = 0; i < bullets.length; i++)
			{ // For all bullets in bullets array:
				if(!bullets[i].onPlay)
					continue;
				if(!zombies[j].onPlay)
					continue;
				if (typeof bullets[i] == 'undefined')
					console.log('bullet undefined!!!');
				if(typeof zombies[j] == 'undefined')
					console.log('zombie undefined!!!');
				if (bullets[i].x + bullets[i].img.width >= zombies[j].x 
					&& bullets[i].x <= zombies[j].x + zombieRightWalk[zombies[j].animationWalkIndex].width)
				{ // Then the x coordinates collide.
					if (bullets[i].y + bullets[i].img.height >= zombies[j].y 
						&& bullets[i].y <= zombies[j].y + zombieRightWalk[zombies[j].animationWalkIndex].height)
					{ // Then the y coordinates collide. We have a collision!
						zombies[j].lives--;
						var imgString = bullets[i].img.src
						var subString = imgString.substring(imgString.length-14,imgString.length)
						if (subString == "img/bullet.png")
						{
							bullets[i].onPlay = false;
						}
						// Checking whether the image source is a regular or diamond bullet, deleting it if the former.
						//bullets.splice(i,i+1);
						zombieDamageSound.load();
						zombieDamageSound.play();
						if (zombies[j].lives == 0)
						{ // If the zombie dies:
							zombies[j].animationState = 2;
							killCounter++;
							updateProgressHUD();
						}
					}
				}
			}
		}
    }
}



function collisionBulletGround()
{
    for (var i = 0; i < bullets.length; i++)
    {
        if(!bullets[i].onPlay)
            continue;
        if (bullets[i].y + bullets[i].img.height + bullets[i].ySpeed > ground.y)
        {
			bullets[i].y = ground.y - bullets[i].img.height;
            bullets[i].ySpeed = -bullets[i].ySpeed;
			bullets[i].bounceCount--;
			if (bullets[i].bounceCount == 0)
				bullets[i].onPlay = false;
        }
    }
}

function collisionBulletFlyingZombie()
{
	for (var j = 0; j < flyingZombies.length; j++)
	{ // For all zombies in the zombies array:
		for (var i = 0; i < bullets.length; i++)
		{ // For all bullets in bullets array:
			if(!bullets[i].onPlay)
				continue;
			if(!flyingZombies[j].onPlay)
				continue;
            if (typeof bullets[i] == 'undefined')
                console.log('bullet undefined!!!');
            if(typeof flyingZombies[j] == 'undefined')
                console.log('zombie undefined!!!');
			if (bullets[i].x + bullets[i].img.width >= flyingZombies[j].x 
				&& bullets[i].x <= flyingZombies[j].x + flyingZombies[j].img.width)
			{ // Then the x coordinates collide.
				if (bullets[i].y + bullets[i].img.height >= flyingZombies[j].y 
					&& bullets[i].y <= flyingZombies[j].y + flyingZombies[j].img.height)
				{ // Then the y coordinates collide. We have a collision!
					flyingZombies[j].lives--;
                    var imgString = bullets[i].img.src
                    var subString = imgString.substring(imgString.length-14,imgString.length)
                    if (subString == "img/bullet.png")
                    {
                        bullets[i].onPlay = false;
                    }
                    // Checking whether the image source is a regular or diamond bullet, deleting it if the former.
					//bullets.splice(i,i+1);
					zombieDamageSound.load();
					zombieDamageSound.play();
					if (flyingZombies[j].lives == 0)
					{ // If the zombie dies:
                        flyingZombies[j].onPlay=false;
						flyingZombies[j].onPlay=false;
						//zombies.splice(j,j+1); // Remove it from the zombies array.
						killCounter++;
						updateProgressHUD();
					}
				}
			}
		}
    }
}

function collisionPlayerFlyingZombie()
{
	for (var i = 0; i < flyingZombies.length; i++)
	{
		if(flyingZombies[i].onPlay)
		{
			if (player.x + player.width - 12 >= flyingZombies[i].x 
				&& player.x <= flyingZombies[i].x + flyingZombies[i].img.width - 12)
			{ // Then the x coordinates collide.
				if (player.y + player.height >= flyingZombies[i].y + 12 
					&& player.y <= flyingZombies[i].y + flyingZombies[i].img.height)
				{ // Then the y coordinates collide. We have a collision!
					if(!player.invulnerable){
						player.livesLeft--;
						console.log('how many times the player dies?' + player.livesLeft);
						if (player.livesLeft == 0){
							gameIsLost = true;
						}
						else{
							console.log('Is this even executed?' + player.livesLeft);
							player.invulnerable = true;
							setTimeout(removeInvulnerability, 2000);
						}
					}
				}
			}	
		}
	}
}

function collisionSlimeGround()
{
	for (var i = 0; i < slimes.length; i++)
	{
		if (slimes[i].y + slimes[i].img.height >= ground.y)
		{
			slimes[i].onPlay = false;
		}
	}
}

function collisionSlimePlayer()
{
	for (var i = 0; i < slimes.length; i++)
	{
		if(!slimes[i].onPlay)
				continue;
		if (typeof slimes[i] == 'undefined')
                console.log('slime undefined!!!');
		if (slimes[i].x + slimes[i].img.width >= player.x && slimes[i].x <= player.x + player.width)
		{
			if (slimes[i].y + slimes[i].img.height >= player.y && slimes[i].y <= player.y + player.height)
			{ 
				if(!player.invulnerable){
					player.livesLeft--;
					console.log('how many times the player dies?' + player.livesLeft);
					if (player.livesLeft == 0){
						gameIsLost = true;
					}
					else{
						console.log('Is this even executed?' + player.livesLeft);
						player.invulnerable = true;
						setTimeout(removeInvulnerability, 2000);
					}
				}
			}
		}
	}
}

function collisionPlayerJumperZombie()
{
	for (var i = 0; i < jumperZombies.length; i++)
	{
		if(jumperZombies[i].onPlay)
		{
			if (player.x + player.width - 12 >= jumperZombies[i].x 
				&& player.x <= jumperZombies[i].x + jumperZombies[i].img.width - 12)
			{ // Then the x coordinates collide.
				if (player.y + player.height >= jumperZombies[i].y + 12 
					&& player.y <= jumperZombies[i].y + jumperZombies[i].img.height)
				{ // Then the y coordinates collide. We have a collision!
					if(!player.invulnerable){
						player.livesLeft--;
						console.log('how many times the player dies?' + player.livesLeft);
						if (player.livesLeft == 0){
							gameIsLost = true;
						}
						else{
							console.log('Is this even executed?' + player.livesLeft);
							player.invulnerable = true;
							setTimeout(removeInvulnerability, 2000);
						}
					}
				}
			}	
		}
	}
}

function collisionBulletJumperZombie()
{
	for (var j = 0; j < jumperZombies.length; j++)
	{ 
		for (var i = 0; i < bullets.length; i++)
		{ 
			if(!bullets[i].onPlay)
				continue;
			if(!jumperZombies[j].onPlay)
				continue;
            if (typeof bullets[i] == 'undefined')
                console.log('bullet undefined!!!');
            if(typeof jumperZombies[j] == 'undefined')
                console.log('jumper zombie undefined!!!');
			if (bullets[i].x + bullets[i].img.width >= jumperZombies[j].x 
				&& bullets[i].x <= jumperZombies[j].x + jumperZombies[j].img.width)
			{ // Then the x coordinates collide.
				if (bullets[i].y + bullets[i].img.height >= jumperZombies[j].y 
					&& bullets[i].y <= jumperZombies[j].y + jumperZombies[j].img.height)
				{ // Then the y coordinates collide. We have a collision!
					jumperZombies[j].lives--;
					var imgString = bullets[i].img.src
                    var subString = imgString.substring(imgString.length-14,imgString.length)
                    if (subString == "img/bullet.png")
                    {
                        bullets[i].onPlay = false;
                    }
                    // Checking whether the image source is a regular or diamond bullet, deleting it if the former.
					zombieDamageSound.load();
					zombieDamageSound.play();
					if (jumperZombies[j].lives == 0)
					{ // If the zombie dies:
                        jumperZombies[j].onPlay=false;
						jumperZombies[j].onPlay=false;
						//zombies.splice(j,j+1); // Remove it from the zombies array.
						killCounter++;
						updateProgressHUD();
					}
				}
			}
		}
    }
}


function collisionPlayerShieldZombie()
{
	for (var i = 0; i < shieldZombies.length; i++)
	{
		if(shieldZombies[i].onPlay)
		{
			if (player.x + player.img.width - 12 >= shieldZombies[i].x 
				&& player.x <= shieldZombies[i].x + shieldZombieRight.width - 12)
			{ // Then the x coordinates collide.
				if (player.y + player.img.height >= shieldZombies[i].y + 12 
					&& player.y <= shieldZombies[i].y + shieldZombieRight.height)
				{ // Then the y coordinates collide. We have a collision!
					if(!player.invulnerable){
						player.livesLeft--;
						console.log('how many times the player dies?' + player.livesLeft);
						if (player.livesLeft == 0){
							gameIsLost = true;
						}
						else{
							console.log('Is this even executed?' + player.livesLeft);
							player.invulnerable = true;
							setTimeout(removeInvulnerability, 2000);
						}
					}
				}
			}	
		}
	}
}

function collisionBulletShieldZombie()
{
    for (var i = 0; i < bullets.length; i++)
    { // For each bullet in the bullets array:
        if(!bullets[i].onPlay)
            continue;
        for (var j = 0; j < shieldZombies.length; j++)
        { // For each shield zombie:
            var leftCollide = false, rightCollide = false, upCollide = false, downCollide = false;
            if (bullets[i].x + bullets[i].img.width + bullets[i].xSpeed >= shieldZombies[j].x)
            { // IMPORTANT: Adding the speed of the bullet to these four if statements is crucial! It prevents the bullet from going inside the pad.
                leftCollide = true;
            }
            if (bullets[i].x  + bullets[i].xSpeed <= shieldZombies[j].x + shieldZombies[j].img.width)
            {
                rightCollide = true;
            }
            if (bullets[i].y + bullets[i].img.height + bullets[i].ySpeed>= shieldZombies[j].y)
            {
                upCollide = true;
            }
            if (bullets[i].y + bullets[i].ySpeed<= shieldZombies[j].y + shieldZombies[j].img.height)
            {
                downCollide = true;
            }
            if (leftCollide && rightCollide && upCollide && downCollide)
            {// Collision occured!
				shieldZombies.length;
                var bulletCenterY = bullets[i].y + bullets[i].img.height/2;
                if ( bulletCenterY > shieldZombies[j].y && bulletCenterY < shieldZombies[j].y + shieldZombies[j].img.height)
                { // Then a horizontal collision occured.
                    if (bullets[i].x < shieldZombies[j].x)
                    { // Then the bullet collided with the left side.
						if (shieldZombies[j].currentDirection == false && player.currentPowerUp != 2)
						{
							bullets[i].x = shieldZombies[j].x - bullets[i].img.width; // This ensures the bullet ricochet animation is smooth.
							bullets[i].xSpeed = -bullets[i].xSpeed;
							bullets[i].bounceCount--;
							if (bullets[i].bounceCount == 0)
								bullets[i].onPlay = false;
						}
						else
						{
							shieldZombies[j].lives--;
							var imgString = bullets[i].img.src
							var subString = imgString.substring(imgString.length-14,imgString.length)
							if (subString == "img/bullet.png")
							{ // Checking whether the image source is a regular or diamond bullet, deleting it if the former.
								bullets[i].onPlay = false;
							}
							zombieDamageSound.load();
							zombieDamageSound.play();
							if (shieldZombies[j].lives == 0)
							{ // If the zombie dies:
								shieldZombies[j].onPlay=false;
								killCounter++;
								updateProgressHUD();
							}
						}
                    }
                    else
                    { // Then the bullet collided with the right side.
						if (shieldZombies[j].currentDirection == true && player.currentPowerUp != 2)
						{
							bullets[i].x = shieldZombies[j].x + shieldZombies[j].img.width; // This ensures the bullet ricochet animation is smooth.
							bullets[i].xSpeed = -bullets[i].xSpeed;
							bullets[i].bounceCount--;
							if (bullets[i].bounceCount == 0)
								bullets[i].onPlay = false;
						}
						else
						{
							shieldZombies[j].lives--;
							var imgString = bullets[i].img.src
							var subString = imgString.substring(imgString.length-14,imgString.length)
							if (subString == "img/bullet.png")
							{ // Checking whether the image source is a regular or diamond bullet, deleting it if the former.
								bullets[i].onPlay = false;
							}
							zombieDamageSound.load();
							zombieDamageSound.play();
							if (shieldZombies[j].lives == 0)
							{ // If the zombie dies:
								shieldZombies[j].onPlay=false;
								killCounter++;
								updateProgressHUD();
							}
						}
					}
                }
                else
				{
					shieldZombies[j].lives--;
					var imgString = bullets[i].img.src
					var subString = imgString.substring(imgString.length-14,imgString.length)
					if (subString == "img/bullet.png")
					{ // Checking whether the image source is a regular or diamond bullet, deleting it if the former.
						bullets[i].onPlay = false;
					}
					zombieDamageSound.load();
					zombieDamageSound.play();
					if (shieldZombies[j].lives == 0)
					{ // If the zombie dies:
						shieldZombies[j].onPlay=false;
						killCounter++;
						updateProgressHUD();
					}
				}
            }
        }
    }
}