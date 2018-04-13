
function getPadX(i){

}

function getPadY(i){
    return canvas.height - pads[i].y;
}

function drawPads(surface){
    for (var i = 0; i < pads.length; i++)
    { 
        // For each pad in the pads array, draw it on the canvas.
        surface.drawImage(pads[i].img, pads[i].x, getPadY(i));
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
			var padY = getPadY(j);
            var leftCollide = false, rightCollide = false, upCollide = false, downCollide = false;
            if (bullets[i].x + bullets[i].img.width + bullets[i].xSpeed >= pads[j].x)
            { // IMPORTANT: Adding the speed of the bullet to these four if statements is crucial! It prevents the bullet from going inside the pad.
                leftCollide = true;
            }
            if (bullets[i].x  + bullets[i].xSpeed <= pads[j].x + pads[j].img.width)
            {
                rightCollide = true;
            }
            if (bullets[i].y + bullets[i].img.height + bullets[i].ySpeed>= padY)
            {
                upCollide = true;
            }
            if (bullets[i].y + bullets[i].ySpeed<= padY + pads[j].img.height)
            {
                downCollide = true;
            }
            if (leftCollide && rightCollide && upCollide && downCollide)
            {// Collision occured!
                var bulletCenterY = bullets[i].y + bullets[i].img.height/2;
                if ( bulletCenterY > padY && bulletCenterY < padY + pads[j].img.height)
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
                    if (bullets[i].y < padY)
                    { // Then the bullet collided with the top side.
                        bullets[i].y = padY - bullets[i].img.height; // This ensures the bullet ricochet animation is smooth.
                    }
                    else
                    { // Then the bullet collided with the bottom side.
                        bullets[i].y = padY + pads[j].img.height; // This ensures the bullet ricochet animation is smooth.
                    }
                    bullets[i].ySpeed = -bullets[i].ySpeed;
                }
            }
        }
    }
}

function collisionCratePad()
{
	for ( var i = 0; i < pads.length; i++)
	{ // For each pad in the pads array:
		var padY = getPadY(i);
        console.log('checking crate collision ', crate.y, padY, CRATE_SPEED);
        if (crate.y + crateImage.height <= padY + pads[i].img.height - CRATE_SPEED 
            && crate.y + crateImage.height >= padY + CRATE_SPEED)
		{ // Then there is a collision between the y coordinates of the crate and the pad.
            if (crate.x + crateImage.width >= pads[i].x 
                && crate.x <= pads[i].x + pads[i].img.width)
			{
                console.log('crate colision with pad!');
				crate.onPad = true;
				crate.y = padY - crate.img.height; // Make sure the crate is exactly on the pad.
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
			var padY = getPadY(i);
			if (jumperZombies[j].inAir) // We only want to check collision between the pad and the zombie when the zombie is falling down.
			{
				if (jumperZombies[j].y + jumperZombies[j].img.height <= padY - jumperZombies[j].verticalVelocity 
					&& jumperZombies[j].y + jumperZombies[j].img.height >= padY + jumperZombies[j].verticalVelocity)
				{ // Then there is a collision between the y coordinates of the zombie and the pad.
					if (jumperZombies[j].x + jumperZombies[j].img.width >= pads[i].x 
						&& jumperZombies[j].x <= pads[i].x + pads[i].img.width)
					{ // Then the x coordinates collide as well. We have a collision!
						jumperZombies[j].onPad = i + 1;
						jumperZombies[j].y = padY - jumperZombies[j].img.height; // Make sure the zombie is exactly on the pad.
						jumperZombies[j].inAir = false;
						jumperZombies[j].verticalVelocity = 0;
						//resetJumpZombie(jumperZombies[j]); // Reset the jump variables so the next jump is not screwed up.
						//console.log(jumperZombies[j].inAir, jumperZombies[j].verticalVelocity);
					}
				}
			}
			if (jumperZombies[j].onPad > 0) // This part captures the moment when the player leaves the pad, so the fall animation can start.
			{
				var padIndex = jumperZombies[j].onPad - 1;
				if (jumperZombies[j].x > pads[padIndex].x + pads[padIndex].img.width || jumperZombies[j].x + jumperZombies[j].img.width < pads[padIndex].x)
				{ // Then the zombie left the pad, time to apply gravity.
					jumperZombies[j].inAir = true;
					jumperZombies[j].onPad = false;
				}
			}
		}
	}
}