var numDiv = 70;
var numDivY = 28;
var counter = 0;
var grid = new Array(numDiv);
var holdMouse = false;
setup();

var canvas = document.getElementById("canvas");
var rect = canvas.getBoundingClientRect();
var ctx = canvas.getContext("2d");
ctx.lineWidth = 0.1;

var animate = window.setInterval(draw,6);
var dim = canvas.clientWidth;
var arrR = [0, 0, 1,-1];
var arrC = [1,-1, 0, 0];

function setup() {
    var dim = 1200;

    for(var i = 0; i < numDiv; i++){
        grid[i] = Array(numDiv);
        for(var j = 0; j < numDiv; j++){
            grid[i][j] = 0;
        }
    }

    grid[20][10] = 3;
    grid[10][10] = 5;

}

function draw() {
    if (canvas.getContext) {

        for(var i = 0; i < numDiv; i++){
            for(var j = 0; j < numDiv; j++){
                if(grid[i][j] == 0){ //empty space
                    ctx.strokeStyle = "#89C4F4";
                    ctx.strokeRect(i * dim/numDiv, j * dim/numDiv, dim/numDiv, dim/numDiv);
                }
                else if(grid[i][j] == 1){ //wall
                    ctx.fillStyle = "#000";
                    ctx.fillRect(i * dim/numDiv, j * dim/numDiv, dim/numDiv, dim/numDiv);
                }
                else if(grid[i][j] == 2){ //visited space
                    ctx.fillStyle = "#425df5";
                    ctx.fillRect(i * dim/numDiv, j * dim/numDiv, dim/numDiv, dim/numDiv);
                }
                else if(grid[i][j] == 3){ //end space
                    ctx.fillStyle = "#f70052";
                    ctx.fillRect(i * dim/numDiv, j * dim/numDiv, dim/numDiv, dim/numDiv);
                }
                else if(grid[i][j] == 4){ //path found
                    ctx.fillStyle = "#14ff7a";
                    ctx.fillRect(i * dim/numDiv, j * dim/numDiv, dim/numDiv, dim/numDiv);
                }
                else if(grid[i][j] == 5){ // start
                    ctx.fillStyle = "#ff14e0";
                    ctx.fillRect(i * dim/numDiv, j * dim/numDiv, dim/numDiv, dim/numDiv);
                }
            }
        }
    }
}

function printArray(){
    var dim = canvas.clientWidth;
    for(var i = 0; i < numDiv; i++){
        for(var j = 0; j < numDiv; j++){
            document.write(grid[i][j] + " ");
        }
        document.write("<br>");
    }
}

function start(event){
    holdMouse = true;
    add(event);
}

function add(event){
    if(holdMouse == true)
    {
        rect = canvas.getBoundingClientRect();
        var x = (event.clientX - rect.left);
        var y = (event.clientY - rect.top);
    
        var i = Math.round(x / canvas.clientWidth * numDiv - 0.5);
        var j = Math.round(y / canvas.clientWidth * numDiv - 0.5);

        grid[i][j] = 1;
    }
}

function stop(){
    holdMouse = false;
}


function search(r, c){
    helper(r, c);
    alert("finished!");
}

function helper(r, c){
    if(grid[r][c] == 3) return true;

    grid[r][c] = 2;
    //pause method
    draw();
    //pause(100);

    var currR, currC;

    for(var i = 0; i < 4; i++){
        currR = r + arrR[i];
        currC = c + arrC[i];

        if(currR < 0 || currR >= numDiv || currC < 0 || currC >= numDivY) continue;
        else if(grid[currR][currC] == 0){
            if(helper(currR,currC) == true){
                grid[currR][currC] = 4;
                return true;
            }
        }
    }
}

function pause(numberMillis) { 
    var bob = true;
    var now = new Date(); 
    var exitTime = now.getTime() + numberMillis; 
    while (bob == true) { 
        now = new Date(); 
        if (now.getTime() > exitTime) 
            bob = false; 
    } 
} 