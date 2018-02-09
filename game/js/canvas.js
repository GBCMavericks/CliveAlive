var canvas = document.querySelector("canvas");
canvas.width = 800; 	
canvas.height = 400;

var surface = canvas.getContext("2d");

var uInt;        // Variable for setInterval.

// The backgound image.
var background = new Image();
background.src = "img/background.jpg";

// This image is displayed when the player dies.
var loseImage = new Image();
loseImage.src = "img/lose.png";  

// Image displayed when the player wins
var winImage = new Image();
winImage.src = "img/win.png";   
var gameIsLost = false  // Set to true when the player dies.
var gameIsWon = false;   // Set to true when the game is won.


