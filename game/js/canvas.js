var canvas = document.querySelector("canvas");
canvas.width = 800; 	
canvas.height = 400;

// The backgound image.
var background = new Image();
background.src = "img/background.jpg";

// This image is displayed when the player dies.
var loseImage = new Image();
loseImage.src = "img/lose.png";  

// Image displayed when the player wins
var winImage = new Image();
winImage.src = "img/win.png";   


window.onload = function()
{
    
    // gets the context to draw on canvas
    var surface = canvas.getContext("2d");
    LoadResources(function(){
        DrawTitle(surface);
    });
};

function LoadResources(callback){

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

