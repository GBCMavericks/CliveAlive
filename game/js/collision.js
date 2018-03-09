function collisionPlayerZombie()
{
	for (var i = 0; i < zombies.length; i++)
	{
		if(zombies[i].onPlay)
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
}

function collisionBulletZombie()
{
	for (var j = 0; j < zombies.length; j++)
	{ // For all zombies in the zombies array:
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
			if (bullets[i].x + bullets[i].img.width >= zombies[j].x && bullets[i].x <= zombies[j].x + zombie.img.width)
			{ // Then the x coordinates collide.
				if (bullets[i].y + bullets[i].img.height >= zombies[j].y && bullets[i].y <= zombies[j].y + zombie.img.height)
				{ // Then the y coordinates collide. We have a collision!
					zombies[j].lives--;
					bullets[i].onPlay = false;
					//bullets.splice(i,i+1);
					zombieDamageSound.load();
					zombieDamageSound.play();
					if (zombies[j].lives == 0)
					{ // If the zombie dies:
						zombies[j].onPlay=false;
						//zombies.splice(j,j+1); // Remove it from the zombies array.
						killCounter++;
						if (killCounter >= maxKillCount)
						{
							gameIsWon = true;
						}
					}
				}
			}
		}
    }
}


function collisionBulletPad()
{
    for (var i = 0; i < bullets.length; i++)
    { // For each bullet in the bullets array:
        if(!bullets[i].onPlay)
            continue;
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
        if(!bullets[i].onPlay)
            continue;
        if (bullets[i].y + bullets[i].img.height + bullets[i].ySpeed > ground.y)
        {
			bullets[i].y = ground.y - bullets[i].img.height;
            bullets[i].ySpeed = -bullets[i].ySpeed;
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
			if (bullets[i].x + bullets[i].img.width >= flyingZombies[j].x && bullets[i].x <= flyingZombies[j].x + flyingZombies[j].img.width)
			{ // Then the x coordinates collide.
				if (bullets[i].y + bullets[i].img.height >= flyingZombies[j].y && bullets[i].y <= flyingZombies[j].y + flyingZombies[j].img.height)
				{ // Then the y coordinates collide. We have a collision!
					flyingZombies[j].lives--;
					bullets[i].onPlay = false;
					//bullets.splice(i,i+1);
					zombieDamageSound.load();
					zombieDamageSound.play();
					if (flyingZombies[j].lives == 0)
					{ // If the zombie dies:
						flyingZombies[j].onPlay=false;
						//zombies.splice(j,j+1); // Remove it from the zombies array.
						killCounter++;
						if (killCounter >= 30)
						{
							gameIsWon = true;
						}
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
			if (player.x + player.img.width - 12 >= flyingZombies[i].x && player.x <= flyingZombies[i].x + flyingZombies[i].img.width - 12)
			{ // Then the x coordinates collide.
				if (player.y + player.img.height >= flyingZombies[i].y + 12 && player.y <= flyingZombies[i].y + flyingZombies[i].img.height)
				{ // Then the y coordinates collide. We have a collision!
					gameIsLost = true;
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
		if (slimes[i].x + slimes[i].img.width >= player.x && slimes[i].x <= player.x + player.img.width)
		{
			if (slimes[i].y + slimes[i].img.height >= player.y && slimes[i].y <= player.y + player.img.height)
			{ 
				gameIsLost = true;
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
			if (player.x + player.img.width - 12 >= jumperZombies[i].x && player.x <= jumperZombies[i].x + jumperZombies[i].img.width - 12)
			{ // Then the x coordinates collide.
				if (player.y + player.img.height >= jumperZombies[i].y + 12 && player.y <= jumperZombies[i].y + jumperZombies[i].img.height)
				{ // Then the y coordinates collide. We have a collision!
					gameIsLost = true;
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
			if (bullets[i].x + bullets[i].img.width >= jumperZombies[j].x && bullets[i].x <= jumperZombies[j].x + jumperZombies[j].img.width)
			{ // Then the x coordinates collide.
				if (bullets[i].y + bullets[i].img.height >= jumperZombies[j].y && bullets[i].y <= jumperZombies[j].y + jumperZombies[j].img.height)
				{ // Then the y coordinates collide. We have a collision!
					jumperZombies[j].lives--;
					bullets[i].onPlay = false;
					zombieDamageSound.load();
					zombieDamageSound.play();
					if (jumperZombies[j].lives == 0)
					{ // If the zombie dies:
						jumperZombies[j].onPlay=false;
						//zombies.splice(j,j+1); // Remove it from the zombies array.
						killCounter++;
						if (killCounter >= maxKillCount)
						{
							gameIsWon = true;
						}
					}
				}
			}
		}
    }
}

function collisionJumperZombiePad()
{
	for ( var j = 0; j < jumperZombies.length; j++)
	{
		for ( var i = 0; i < pads.length; i++)
		{ // For each pad in the pads array:
			if (jumperZombies[j].inAir) // We only want to check collision between the pad and the zombie when the zombie is falling down.
			{
				if (jumperZombies[j].y + jumperZombies[j].img.height <= pads[i].y - jumperZombies[j].verticalVelocity && jumperZombies[j].y + jumperZombies[j].img.height >= pads[i].y + jumperZombies[j].verticalVelocity)
				{ // Then there is a collision between the y coordinates of the zombie and the pad.
					if (jumperZombies[j].x + jumperZombies[j].img.width >= pads[i].x && jumperZombies[j].x <= pads[i].x + pads[i].img.width)
					{ // Then the x coordinates collide as well. We have a collision!
						jumperZombies[j].onPad = true;
						pads[i].onPadZombie = true;
						jumperZombies[j].y = pads[i].y - jumperZombies[j].img.height; // Make sure the zombie is exactly on the pad.
						resetJumpZombie(jumperZombies[j]); // Reset the jump variables so the next jump is not screwed up.
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
			if (pads[i].onPadZombie) // This part captures the moment when the player leaves the pad, so the fall animation can start.
			{
				if (jumperZombies[j].x > pads[i].x + pads[i].img.width || jumperZombies[j].x + jumperZombies[j].img.width < pads[i].x)
				{ // Then the player left the pad, time to apply gravity.
					jumperZombies[j].inAir = true;
					jumperZombies[j].onPad = false;
					pads[i].onPadZombie = false;
				}
			}
		}
	}
}