class Node{
    constructor(r, c){
        this.r = r;
        this.c = c;
    }
}

var numDiv = 70, numDivY = 28;
var counter = 0;
const INT_MAX = 10000000;
var grid = new Array(numDiv);
var adj = new Array(numDiv * numDivY);
var weight = new Array(numDiv);
var stepsize = new Array(numDiv);
var totWeight = new Array(numDiv)
var prioq = [];
var holdMouse = false;

setup();

var canvas = document.getElementById("canvas");
var rect = canvas.getBoundingClientRect();
var ctx = canvas.getContext("2d");
ctx.lineWidth = 0.1;

var animate = window.setInterval(draw,6);

var dim = canvas.clientWidth;
let arrC = [0, -1, 0,1];
let arrR = [1, 0,-1, 0];

function setup() {
    for(var i = 0; i < numDiv; i++){
        grid[i] = Array(numDivY);
        weight[i] = Array(numDivY);
        totWeight[i] = Array(numDivY);
        stepsize[i] = Array(numDivY);
        for(var j = 0; j < numDivY; j++){
            grid[i][j] = 0;
            weight[i][j] = INT_MAX;
            stepsize[i][j] = 1;
            adj[counter] = -1;
            counter++;
        }
    }
    counter = 0;

    grid[30][20] = 3;
    grid[10][10] = 5;

}

function draw() {
    if (canvas.getContext) {

        for(var i = 0; i < numDiv; i++){
            for(var j = 0; j < numDivY; j++){
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


function search(){
    reset();
    prioq.push(new Node(10, 10));
    prioq.push(new Node(40, 40));
    weight[10][10] = 0;
    weight[40][40] = INT_MAX;
    totWeight[10][10] = calcH(10, 10);
    totWeight[40][40] = calcH(40, 40);
    helper();
}

//---------------------------

async function helper(){
    var thisNode;
    var r, c;
    let currR, currC;
    var bob;
    var trueR, trueC;
    var indx = 0;
    var w = 0;

    while(indx < prioq.length){
        thisNode = prioq[indx];
        r = thisNode.r;
        c = thisNode.c;
        w = weight[r][c];

        if(grid[r][c] == 2){
            indx++;
            continue;
        }

        grid[r][c] = 2;
        bob = await doSetTimeout();

        for(let i = 0; i < 4; i++){
            currR = r + arrR[i];
            currC = c + arrC[i];

            //console.log(weight[r][c] + " " + totWeight[r][c] + " -- " + weight[currR][currC] + " " + totWeight[currR][currC]);
            if(check(currR, currC, w) == true){
                if(grid[currR][currC] == 3){
                    trueR = r;
                    trueC = c;
                    indx = prioq.length;
                    break;
                }
                adj[currR *numDivY + currC] = r * numDivY + c;
                qin(currR, currC, indx);
            }
        }
        grid[10][10] = 5;
        indx++;
    }

    ending(trueR * numDivY + trueC);
    var a, b, c;
    for(var i = 0; i < prioq.length; i++)
    { 
        a = prioq[i].r;
        b = prioq[i].c
        c = totWeight[a][b];
        //console.log(a + " " + b + " " + c);
    }
    grid[10][10] = 5;
}


//binary search insert
function qin(r, c, indx){
    var w = totWeight[r][c];
    var low = indx+1; 
    var high = prioq.length - 1;
    var mid = Math.floor((low + high)/2);
    var before = false;

    if(w > totWeight[prioq[high].r][prioq[high].c]){
        prioq.push(new Node(r, c));
        return;
    }
    if(w < totWeight[prioq[low].r][prioq[low].c]){
        prioq.splice(low, 0, new Node(r,c));
        return;
    }

    while(low < high){
        if(w == totWeight[prioq[mid].r][prioq[mid].c]){
            prioq.splice(mid+1, 0, new Node(r,c));
            return;
        }
        else if(w < totWeight[prioq[mid].r][prioq[mid].c]){
            high = mid-1;
            before = true;
        }
        else{
            low = mid+1;
            before = false;
        }

        mid = Math.floor((low + high)/2);
    }
    if(before)
        prioq.splice(high+1, 0, new Node(r,c));
    else
        prioq.splice(high, 0, new Node(r,c));
    return;
}









//---------------------------

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

function check(r, c, w){
    if(r < 0 || r >= numDiv || c < 0 || c >= numDivY){
        return false;
    }
    
    if(grid[r][c] == 0 || grid[r][c] == 3){
        if(w + stepsize[r][c] < weight[r][c]){
            if(totWeight[r][c] == -1){
                totWeight[r][c] = calcH(r, c) + w + stepsize[r][c];
            }
            else{
                totWeight[r][c] -= (weight[r][c] - (w + stepsize[r][c]));
            }
            weight[r][c] = w + stepsize[r][c];
            console.log(r + " " + c);
            return true
        }
        return false;
    }
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
            weight[i][j] = INT_MAX;
            totWeight[i][j] = -1;
            adj[counter] = -1;
            counter++;

            num = grid[i][j];
            if(num == 2 || num == 4){
                grid[i][j] = 0;
                ctx.fillStyle = "#fff";
                ctx.fillRect(i * dim/numDiv, j * dim/numDiv, dim/numDiv, dim/numDiv);
            }
        }
    }
    prioq = [];
    adj[10 * numDivY + 10] = 10 * numDivY + 10;
}


function calcH(r, c){
    var dx = (30-r) * (31-r);
    var dy = Math.abs(20-c);
    var D = 1;
    return Math.floor(dx + dy);
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