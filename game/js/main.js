var canvas = document.querySelector("canvas");
canvas.width = 800; 	
canvas.height = 400;

var surface = canvas.getContext("2d");

var uInt;        // Variable for setInterval.
var background;  // The backgound image.
var loseImage;   // This image is displayed when the player dies.
var winImage;
var gameIsLost;  // Set to true when the player dies.
var gameIsWon;   // Set to true when the game is won.

surface.font="20px zombieSlayer";
ctx.fillText("Clive Alive",10,50);
