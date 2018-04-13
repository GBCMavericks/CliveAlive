const sprayCoef = 0.6;
var powerupAmmo;

function moveBullet()
{
    var currentBullet;
    for (var i = 0; i < bullets.length; i++)
    { // For each bullet in bullets array:
        if(!bullets[i].onPlay)
            continue;
        currentBullet = bullets[i];
        currentBullet.x += currentBullet.xSpeed;
        currentBullet.y += currentBullet.ySpeed;
    }
};

function drawBullets(surface)
{
    for (var i = 0; i < bullets.length; i++)
    { // For each bullet in bullets array:
        if(bullets[i].onPlay)
            surface.drawImage(bullets[i].img,bullets[i].x,bullets[i].y); // Draw the bullet on the canvas.
    }
}

function cleanBulletArray()
{
	var newBullets = [];
	for (var i = 0; i < bullets.length; i++)
	{
		if(bullets[i].onPlay)
		{
			newBullets.push(bullets[i]);
		}
	}
    bullets = newBullets;
}

function fire(event)
{
    shootSound.play(); // Play the shooting sound effect. Pew pew pew!
    var mouseX = event.clientX - surface.canvas.offsetLeft; // You have to subtract the offset value
    var mouseY = event.clientY - surface.canvas.offsetTop;  // to get the mouse coordinate inside the canvas.
    shootSound.play(); // Play the shooting sound effect. Pew pew pew!
	var bulletX, bulletY;
	var bulletMargin = PLAYER_SPEED + 15;
	if (currentDirection)
		bulletX = player.x + player.img.width + bulletMargin;
	else
		bulletX = player.x - bulletImage.width - bulletMargin;
	bulletY = player.y + player.img.height/2;
	// THIS IS WHERE THE TRAJECTORY OF THE BULLET IS CALCULATED. CONTACT ME (EKIN) IF YOU HAVE ANY QUESTIONS ABOUT THIS**
    var xCoef = mouseX - bulletX;
    var yCoef = mouseY - bulletY;
	var xCoefB = xCoef * Math.cos(sprayCoef) - yCoef * Math.sin(sprayCoef)
	var yCoefB = yCoef * Math.cos(sprayCoef) + xCoef * Math.sin(sprayCoef)
	var xCoefC = xCoef * Math.cos(-sprayCoef) - yCoef * Math.sin(-sprayCoef)
	var yCoefC = yCoef * Math.cos(-sprayCoef) + xCoef * Math.sin(-sprayCoef)
    var commonSpeedVariable = 1 / (Math.abs(xCoef) + Math.abs(yCoef));
    var finalSpeedX = commonSpeedVariable * xCoef * BULLET_SPEED_MULTIPLIER;
    var finalSpeedY = commonSpeedVariable * yCoef * BULLET_SPEED_MULTIPLIER;
    // END OF BULLET TRAJECTORY CALCULATION *****************************************************************************
    if (player.currentPowerUp == 0){
        /* normal bullets */
        bullets.push(
		{
			img: bulletImage,
			x: bulletX,
			y: bulletY,
			xSpeed: finalSpeedX,
			ySpeed: finalSpeedY,
			onPlay: true,
			bounceCount: 3
		});
    }
    else if (player.currentPowerUp == 1) {
        bullets.push(
		{
			img: bulletImage,
			x: bulletX,
			y: bulletY,
			xSpeed: finalSpeedX,
			ySpeed: finalSpeedY,
			onPlay: true,
			bounceCount: 3
		});
        var finalSpeedX2 = commonSpeedVariable * xCoefB * BULLET_SPEED_MULTIPLIER;
        var finalSpeedY2 = commonSpeedVariable * yCoefB * BULLET_SPEED_MULTIPLIER;
        var finalSpeedX3 = commonSpeedVariable * xCoefC * BULLET_SPEED_MULTIPLIER;
        var finalSpeedY3 = commonSpeedVariable * yCoefC * BULLET_SPEED_MULTIPLIER;
        bullets.push(
		{
			img: bulletImage,
			x: bulletX,
			y: bulletY,
			xSpeed: finalSpeedX2,
			ySpeed: finalSpeedY2,
			onPlay: true,
			bounceCount: 3
		});
        bullets.push(
		{
			img: bulletImage,
			x: bulletX,
			y: bulletY,
			xSpeed: finalSpeedX3,
			ySpeed: finalSpeedY3,
			onPlay: true,
			bounceCount: 3
		});
        powerUpAmmo = powerUpAmmo - 1;
        /*
         * At the end of the bullets reverts to original ammo
         */
        if (powerUpAmmo == 0)
        {
            player.currentPowerUp = 0;
        }
    }
    else if (player.currentPowerUp == 2)
    {
        bullets.push(
		{
			img: bulletImageD,
			x: bulletX,
			y: bulletY,
			xSpeed: finalSpeedX,
			ySpeed: finalSpeedY,
			onPlay: true,
			bounceCount: 3
		});
        powerUpAmmo = powerUpAmmo - 1;
        /*
         * At the end reverts to original ammo 
         */
        if (powerUpAmmo == 0)
        {
            player.currentPowerUp = 0;
        }
    }
}
