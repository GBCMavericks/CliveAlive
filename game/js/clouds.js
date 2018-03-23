const CLOUD_VELOCITY_MULTIPLIER = 30 / FPS;

var clouds = [];

function drawClouds(ctx){
    for(var i = 0; i < clouds.length; i++)
    {
        ctx.drawImage(clouds[i].img, clouds[i].x, clouds[i].y);
    }
}

function spawnCloud()
{
    var currentCloud = {};
    currentCloud.img = cloudSprites[Math.random() > 0.5 ? 0 : 1];
    currentCloud.x = canvas.width; // Spawn on the right side of the screen.
    currentCloud.y = Math.ceil(Math.random() * canvas.height); // Spawn at a random height.
    currentCloud.parallaxLayer = Math.ceil(Math.random() * 4); // Indexed starting at one so that we can multiply the layer by a velocity constant.
    clouds.push(currentCloud);
}

function moveClouds()
{
    for(var i = 0; i < clouds.length; i++)
    {
        clouds[i].x -= clouds[i].parallaxLayer * CLOUD_VELOCITY_MULTIPLIER;
        if(clouds[i].x < 0 -200) // If the cloud moves far off-screen,
        {
            clouds.splice(i, 1); // delete the cloud,
            spawnCloud(); // and then spawn a new one to replace it.
        }
    }
}

