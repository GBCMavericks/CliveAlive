function moveBullet()
{
    var currentBullet;
    for (var i = 0; i < bullets.length; i++)
    { // For each bullet in bullets array:
        if(!bullets[i].onPlay)
            continue;
        currentBullet = bullets[i];
        if (currentBullet.x > canvas.width || currentBullet.x < 0 || currentBullet.y > canvas.height || currentBullet.y < 0)
        { // Then the current bullet is out of the canvas. Time to delete it from the bullets array.
            bullets.splice(i,i+1); // Removes the current bullet from the bullet array.
        }

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
    if (currentPowerUp == 0) {
        var mouseX = event.clientX - surface.canvas.offsetLeft; // You have to subtract the offset value
        var mouseY = event.clientY - surface.canvas.offsetTop;  // to get the mouse coordinate inside the canvas.
        // THIS IS WHERE THE TRAJECTORY OF THE BULLET IS CALCULATED. CONTACT ME (EKIN) IF YOU HAVE ANY QUESTIONS ABOUT THIS**
        var xCoef = mouseX - player.x;
        var yCoef = mouseY - player.y;
        var commonSpeedVariable = 1 / (Math.abs(xCoef) + Math.abs(yCoef));
        var commonSpeedVariable2 ;
        var commonSpeedVariable3 ;
        var finalSpeedX = commonSpeedVariable * xCoef * BULLET_SPEED_MULTIPLIER;
        var finalSpeedY = commonSpeedVariable * yCoef * BULLET_SPEED_MULTIPLIER;
        // END OF BULLET TRAJECTORY CALCULATION *****************************************************************************
        var bulletImage = new Image();
        bulletImage.src = "img/bullet.png";
        bullets.push(
            {
                img: bulletImage,
                x: player.x,
                y: player.y,
                xSpeed: finalSpeedX,
                ySpeed: finalSpeedY,
                onPlay: true,
            });
    };
    if (currentPowerUp == 1) {
        var mouseX = event.clientX - surface.canvas.offsetLeft; // You have to subtract the offset value
        var mouseY = event.clientY - surface.canvas.offsetTop;  // to get the mouse coordinate inside the canvas.
        // THIS IS WHERE THE TRAJECTORY OF THE BULLET IS CALCULATED. CONTACT ME (EKIN) IF YOU HAVE ANY QUESTIONS ABOUT THIS**
        var xCoef = mouseX - player.x;
        var yCoef = mouseY - player.y;
        var commonSpeedVariable = 1 / (Math.abs(xCoef) + Math.abs(yCoef));
        var commonSpeedVariable2 ;
        var commonSpeedVariable3 ;
        var finalSpeedX = commonSpeedVariable * xCoef * BULLET_SPEED_MULTIPLIER;
        var finalSpeedY = commonSpeedVariable * yCoef * BULLET_SPEED_MULTIPLIER;
        var finalSpeedX2 = commonSpeedVariable * xCoef * BULLET_SPEED_MULTIPLIER;
        var finalSpeedY2 = commonSpeedVariable * yCoef * BULLET_SPEED_MULTIPLIER;
        var finalSpeedX3 = commonSpeedVariable * xCoef * BULLET_SPEED_MULTIPLIER;
        var finalSpeedY3 = commonSpeedVariable * yCoef * BULLET_SPEED_MULTIPLIER;
        // END OF BULLET TRAJECTORY CALCULATION *****************************************************************************
        var bulletImage = new Image();
        bulletImage.src = "img/bullet.png";
        bullets.push(
            {
                img: bulletImage,
                x: player.x,
                y: player.y,
                xSpeed: finalSpeedX,
                ySpeed: finalSpeedY,
                onPlay: true,
            });
        bullets.push(
            {
                img: bulletImage,
                x: player.x,
                y: player.y,
                xSpeed: finalSpeedX2,
                ySpeed: finalSpeedY2,
                onPlay: true,
            });
        bullets.push(
            {
                img: bulletImage,
                x: player.x,
                y: player.y,
                xSpeed: finalSpeedX3,
                ySpeed: finalSpeedY3,
                onPlay: true,
            });
        powerUpAmmo = powerUpAmmo - 1;
        if (powerUpAmmo == 0)
        {
            currentPowerUp = 0;
        }
    }
}
