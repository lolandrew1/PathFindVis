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
var stack = [];
var adj = new Array(numDiv * numDivY);
var holdMouse = false;
var startr, startc;
var endr, endc;
var last_state = 0;
var ismoving;
var isfinding = false;   
setup();

var canvas = document.getElementById("canvas");
var rect = canvas.getBoundingClientRect();
var ctx = canvas.getContext("2d");
ctx.lineWidth = 0.1;

var animate = window.setInterval(draw,6);

var dim = canvas.clientWidth;
let arrR = [0, -1, 0,1];
let arrC = [1, 0,-1, 0];
var styles = ["#fff", "#000", "#425df5", "#f70052", "#14ff7a", "#ff14e0"];

function setup() {
    var dim = 1200;
    ismoving = 0;

    for(var i = 0; i < numDiv; i++){
        grid[i] = Array(numDiv);
        for(var j = 0; j < numDivY; j++){
            grid[i][j] = 0;
            adj[counter] = -1;
            counter++;
        }
    }

    startr = 10;
    startc = 13;
    endr = 40;
    endc = 13;
    grid[endr][endc] = 3;
    grid[startr][startc] = 5;

}

function draw() {
    if (canvas.getContext) {
        ctx.fillStyle = "#asdfas";
        for(var i = 0; i < numDiv; i++){
            for(var j = 0; j < numDiv; j++){
                if(grid[i][j] == 0){ //empty space
                    ctx.strokeStyle = "#89C4F4";
                    ctx.strokeRect(i * dim/numDiv, j * dim/numDiv, dim/numDiv, dim/numDiv);
                    continue;
                }
                else if(grid[i][j] == 1){ //wall
                    ctx.fillStyle = styles[1];
                }
                else if(grid[i][j] == 2){ //visited space
                    ctx.fillStyle = styles[2];
                }
                else if(grid[i][j] == 3){ //end space
                    ctx.fillStyle = styles[3];
                }
                else if(grid[i][j] == 4){ //path found
                    ctx.fillStyle = styles[4];
                }
                else if(grid[i][j] == 5){ // start
                    ctx.fillStyle = styles[5];
                }
                ctx.fillRect(i * dim/numDiv, j * dim/numDiv, dim/numDiv, dim/numDiv);
            }
        }
    }
}

function start(event){
    if(isfinding)return;
    holdMouse = true;
    rect = canvas.getBoundingClientRect();
    var x = (event.clientX - rect.left);
    var y = (event.clientY - rect.top);

    var i = Math.round(x / canvas.clientWidth * numDiv - 0.5);
    var j = Math.round(y / canvas.clientWidth * numDiv - 0.5);

    ismoving = grid[i][j];
    if(ismoving == 0) ismoving = 1;
    add(event);
}

function stop(){
    holdMouse = false;
    ismoving = 0;
}

function add(event){
    if(isfinding)return;
    if(holdMouse == true)
    {
        rect = canvas.getBoundingClientRect();
        var x = (event.clientX - rect.left);
        var y = (event.clientY - rect.top);
    
        var i = Math.round(x / canvas.clientWidth * numDiv - 0.5);
        var j = Math.round(y / canvas.clientWidth * numDiv - 0.5);


        if(ismoving == 5){
            if(grid[i][j] == 5 || grid[i][j] == 3) return;

            //set last block to what is was before
            grid[startr][startc] = last_state;
            
            ctx.fillStyle = styles[last_state];
            ctx.fillRect(startr * dim/numDiv, startc * dim/numDiv, dim/numDiv, dim/numDiv);

            //record the state of the current block
            startr = i;
            startc = j;
            last_state = grid[i][j];

            //change the current block state
            grid[i][j] = 5;
        }
        else if(ismoving == 3){
            if(grid[i][j] == 5 || grid[i][j] == 3) return;

            //set last block to what is was before
            grid[endr][endc] = last_state;
            ctx.fillStyle = styles[last_state];
            ctx.fillRect(endr * dim/numDiv, endc * dim/numDiv, dim/numDiv, dim/numDiv);

            //record the state of the current block
            endr = i;
            endc = j;
            last_state = grid[i][j];

            //change the current block state
            grid[i][j] = 3;
        }
        else if(ismoving == 1){
            if(grid[i][j] == 3 || grid[i][j] == 5) return;
            grid[i][j] = 1;
            ctx.fillStyle = styles[1];
            ctx.fillRect(i * dim/numDiv, j * dim/numDiv, dim/numDiv, dim/numDiv);
        }
    }
}

function search(){
    reset();
    isfindinig = true;
    stack.push(new Node(startr,startc));
    helperStack();
}
//-----------------------------

adj[numDivY * startr + startc] = (numDivY * startr + startc);

async function helperStack(){
    var thisNode;
    var r, c;
    let currR, currC;
    var bob;
    var trueR, trueC;
    var pass = false;

    thisNode = stack.pop();
        r = thisNode.r;
        c = thisNode.c;
        for(let i = 0; i < 4; i++){
            currR = r + arrR[i];
            currC = c + arrC[i];

            if(check(currR, currC) == true){
                adj[currR * numDivY + currC] = r * numDivY + c;
                stack.push(new Node(currR, currC));
            }
        }


    while(stack.length != 0){
        thisNode = stack.pop();
        r = thisNode.r;
        c = thisNode.c;

        pass = false;

        if(grid[r][c] == 3){
            trueR = r;
            trueC = c;
            break;
        }

        for(let i = 0; i < 4; i++){
            currR = r + arrR[i];
            currC = c + arrC[i];

            if(check(currR, currC) == true){
                pass = true;
                grid[r][c] = 2;
                adj[currR * numDivY + currC] = r * numDivY + c;
                stack.push(new Node(currR, currC));
            }
        }
        if(pass)
            bob = await doSetTimeout();
    }
    ending(trueR * numDivY + trueC);
}

function doSetTimeout() { 
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(0);
      }, 20);
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
        console.log(r, c);
        return false;
    }
    if(grid[r][c] == 0 || grid[r][c] == 3) return true;
    return false;
}

async function ending(num){
    var r, c, bob;

    while(adj[num] != num){
        num = adj[num];

        var r = Math.floor(num/numDivY);
        var c = num % numDivY;
        grid[r][c] = 4;
        bob = await doSetTimeoutFin();
    }
    isfinding = false;
    grid[startr][startc] = 5;
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

    stack = [];
    adj[startr * numDivY + startc] = startr * numDivY + startc;
    isfinding = false;
}

function clearWalls(){
    for(var i = 0; i < numDiv; i++){
        for(var j = 0; j < numDivY; j++){
            if(grid[i][j] == 1){
                grid[i][j] = 0;
                ctx.fillStyle = "#fff";
                ctx.fillRect(i * dim/numDiv, j * dim/numDiv, dim/numDiv, dim/numDiv);
            }
        }
    }
}