const BLACK = '#000000';
const BLOOD_RED = '#B10610';
const YELLOW = '#FED631';
const BUTTON_COLOR='orange';

var buttonData = {
    fontSize: 40,
    paddingLeft: 10,
    paddingTop: 45,
    height: 60,
    width:300,
};

var buttons = [];
function drawButtons(ctx){
    for(var i = 0; i < buttons.length; i++)
    {
        var currentButton = buttons[i];
        ctx.rect(currentButton.left, currentButton.top, buttonData.width, buttonData.height);
        ctx.fillStyle = BUTTON_COLOR;
        ctx.fill();
        ctx.font = buttonData.fontSize + "px zombieSlayer";
        ctx.fillStyle = BLOOD_RED;
        ctx.fillText(currentButton.text, 
                     currentButton.left + buttonData.paddingLeft, 
                     currentButton.top + buttonData.paddingTop);        
    }
}

