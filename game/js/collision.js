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
		if (!goingUp) // We only want to check collision between the pad and the player when the player is falling down.
		{
			if (player.y + player.img.height <= pads[i].y + jumpSpeed && player.y + player.img.height >= pads[i].y - jumpSpeed)
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
				applyPlayerGravity = true;
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
