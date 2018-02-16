function drawLoseInstructions(ctx){
    glow++;
    ctx.font="30px Comic Sans MS";

    if(glow < BLACK_TITLE){
        ctx.fillStyle="#000000";        
    }
    else if(glow >= BLACK_TITLE && glow < RED_TITLE){
        ctx.fillStyle = BLOOD_RED;
    }
    else{
        ctx.fillStyle = YELLOW;
    }
    if(glow > TOTAL_INTERVAL)
        glow = 0;
    ctx.fillText("PRESS 'R' TO RESTART",220,200);
};