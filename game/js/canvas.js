var canvas = document.querySelector("canvas");
canvas.width = 800; 	
canvas.height = 400;

// External File Variables
var background = {};
var ground = {};
var loseImage = {};
var winImage = {};
var player = {};
var crate = {};
var zombie = {};
var pad1 = {};
var pad2 = {};
var loadedResources = 0;
const NUM_RESOURCES = 9;

window.onload = function()
{
    // gets the context to draw on canvas
    var surface = canvas.getContext("2d");
    LoadResources(function(){
        DrawBackground(surface);
        DrawTitle(surface);
    });
};

function LoadCounter(callback){
    console.log(loadedResources);
    if(++loadedResources == NUM_RESOURCES){
        callback();
    }
}

function LoadResources(callback){
    background.img = new Image();
    background.img.src = "img/background.jpg";
    background.img.onload = function(){LoadCounter(callback);}

    ground.img = new Image();
    ground.img.src = "img/ground.png";
    ground.img.onload = function(){LoadCounter(callback);}
    
    loseImage = new Image();
    loseImage.src = "img/lose.png";
    loseImage.onload = function(){LoadCounter(callback);}

    winImage = new Image();
    winImage.src = "img/win.png";
    winImage.onload = function(){LoadCounter(callback);}

    player.img = new Image();
    player.img.src = "img/playerRight.png";
    player.img.onload = function(){LoadCounter(callback);}

	crate.img = new Image();
    crate.img.src = "img/crate.png";
    crate.img.onload = function(){LoadCounter(callback);}
    
    zombie.img = new Image();
    zombie.img.src = "img/zombieRight.png";
    zombie.img.onload = function(){LoadCounter(callback);}

    pad1.img = new Image();
    pad1.img.src = "img/pad.png";
    pad1.img.onload = function(){LoadCounter(callback);}

    pad2.img = new Image();
    pad2.img.src = "img/pad.png";
    pad2.img.onload = function(){LoadCounter(callback);}
}

function DrawBackground(ctx){
	background.x = 0;
	background.y = 0;
	ground.offset = 20;
	ground.x = 0;
	ground.y = background.img.height - ground.img.height + ground.offset;
    ctx.clearRect(0,0,canvas.width,canvas.height); // Clear the canvas first.
    console.log(background, ground);
    ctx.drawImage(background.img, background.x, background.y); // Draw the background.
	ctx.drawImage(ground.img, ground.x, ground.y); // Draw the ground.

}

function DrawTitle(ctx){
    ctx.font="120px zombieSlayer";
    ctx.fillStyle="#B10610";
    ctx.fillText("Clive Alive",90,120);
    
};
/*

var uInt;        // Variable for setInterval.

var gameIsLost = false  // Set to true when the player dies.
var gameIsWon = false;   // Set to true when the game is won.
*/

