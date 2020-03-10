class Node{
    constructor(r, c){
        this.r = r;
        this.c = c;
    }
}

var numDiv = 70;
var numDivY = 28;
var counter = 0;
let grid = new Array(numDiv);
var queue = [];
var adj = new Array(numDiv * numDivY);
var holdMouse = false;
setup();

var canvas = document.getElementById("canvas");
var rect = canvas.getBoundingClientRect();
var ctx = canvas.getContext("2d");
ctx.lineWidth = 0.1;

var animate = window.setInterval(draw,6);

var dim = canvas.clientWidth;
let arrR = [0, -1, 0,1];
let arrC = [1, 0,-1, 0];

function setup() {
    var dim = 1200;

    for(var i = 0; i < numDiv; i++){
        grid[i] = Array(numDiv);
        for(var j = 0; j < numDivY; j++){
            grid[i][j] = 0;
            adj[counter] = -1;
            counter++;
        }
    }
    counter = 0;

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
    reset();
    queue.push(new Node(10,10));
    helperQueue();
}
//-----------------------------

adj[numDivY * 10 + 10] = (numDivY * 10 + 10);

async function helperQueue(){
    var thisNode;
    var r, c;
    let currR, currC;
    var bob;
    var trueR, trueC;
    var pass = false;
    var indx = 0;

    while(indx < queue.length){
        thisNode = queue[indx];
        indx++;
        r = thisNode.r;
        c = thisNode.c;

        for(let i = 0; i < 4; i++){
            currR = r + arrR[i];
            currC = c + arrC[i];

            if(check(currR, currC) == true){
                if(grid[currR][currC] == 3){
                    trueR = r;
                    trueC = c;
                    indx = queue.length;
                    break;
                }
                pass = true;
                grid[currR][currC] = 2;
                adj[currR *numDivY + currC] = r * numDivY + c;
                queue.push(new Node(currR, currC));
            }
        }
        if(pass == true){
            bob = await doSetTimeout();
        }
    }

    ending(trueR * numDivY + trueC);
}

function doSetTimeout() { 
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(0);
      }, 10);
    });
}

function doSetTimeoutFin() { 
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(0);
      }, 0);
    });
}

  function check(r, c){
    if(r < 0 || r >= numDiv || c < 0 || c >= numDivY){
        return false;
    }
    if(grid[r][c] == 0 || grid[r][c] == 3) return true;
    return false;
}

async function ending(num){
    var r, c, bob;
    while(adj[num] != num){
        var r = Math.floor(num/numDivY);
        var c = num % numDivY;
        grid[r][c] = 4;
        num = adj[num];
        bob = await doSetTimeoutFin();
    }
}

function reset(){
    var num;
    counter = 0;
    for(var i = 0; i < numDiv; i++){
        for(var j = 0; j < numDivY; j++){
            num = grid[i][j];
            adj[counter] = -1;
            counter++;
            if(num == 2 || num == 4){
                grid[i][j] = 0;
                ctx.fillStyle = "#fff";
                ctx.fillRect(i * dim/numDiv, j * dim/numDiv, dim/numDiv, dim/numDiv);
            }
        }
    }
    queue = [];
    adj[10 * numDivY + 10] = 10 * numDivY + 10;
}