// PICKUP RELATED VARIABLES **********************************************************************************************************
var crate = 
{
	img:null, // Image of the crate.
	x:null, // X-coordinate of the crate.
	y:null, // Y-coordinate of the crate.
	onGround:null, // True: crate is on the ground. False: crate is nit on the ground.
	onPad:null, // True: crate is on a pad. False: crate is not on a pad.
	hide:null, // True: hide the crate image. False: render the crate image.
};

const CRATE_SPEED = 120 / FPS;
var crateCounter; // Spawn timer of the crate.
var crateSound = document.createElement("AUDIO");
var currentPowerUp = 0; // 0: normal, 1: spray, 2: diamond
const POWERUP_USES = 5;
var powerUpAmmo; // Number of uses of the power-up
// END OF PICKUP RELATED VARIABLES ***************************************************************************************************

function initializeCrate()
{
	crate.img = crateImage;
	crate.x = Math.random() * (canvas.width - crateImage.width);;
	crate.y = -crateImage.height;
	crate.onGround = false;
	crate.onPad = false;
	crate.hide = true;
}

function spawnCrate()
{
	crate.x = Math.random() * (canvas.width - crateImage.width);
	crate.y = -crateImage.height;
	crate.onGround = false;
	crate.onPad = false;
	crate.hide = false;
	setTimeout(hideCrate, 10000);
}

function hideCrate()
{
	crate.x = 0;
	crate.y = 0;
	crate.hide = true;
}

function moveCrate()
{
	if (!crate.onGround || !crate.onPad)
	{
		crate.y += CRATE_SPEED;
	}
}

function drawCrate(surface)
{
	if (!crate.hide)
	{
		surface.drawImage(crate.img,crate.x,crate.y); // Draw the crate.
	}

}

