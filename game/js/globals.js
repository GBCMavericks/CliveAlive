const GRAVITY_MULTIPLIER = 40;
const RECALCULATE_GLOBALS_INTERVAL = 1000; // How many frames to render before recalculating the globals.

var fps = 60; // We need to assume a starting FPS. This will be detected later, so the assumption doesn't matter.
var frameCounter = 0;
var lastFrameTime;
var jumpInitialVelocity; // The player's vertical velocity at the beginning of a jump.
var gravity;
var playerSpeed;
var bulletSpeedMultiplier; // A vairable used to determine the value of bullet speed.
var crateSpeed;

function recalculateGlobals()
{
    jumpInitialVelocity = 600 / fps;
    gravity = (GRAVITY_MULTIPLIER / fps) / (fps / 30);
    playerSpeed = 240 / fps;
    bulletSpeedMultiplier = 600 / fps;
    crateSpeed = 120 / fps;
    lastFrameTime = window.performance.now();
    frameCounter++;
}