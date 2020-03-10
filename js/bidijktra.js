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
var adj = new Array(numDiv * numDivY);
var weight = new Array(numDiv);
var stepsize = new Array(numDiv);
var prioq = [];
var prioq2 = [];
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
    for(var i = 0; i < numDiv; i++){
        grid[i] = Array(numDivY);
        weight[i] = Array(numDivY);
        stepsize[i] = Array(numDivY);
        for(var j = 0; j < numDivY; j++){
            grid[i][j] = 0;
            weight[i][j] = 1000000;
            stepsize[i][j] = 1;
            adj[counter] = -1;
            counter++;
        }
    }
    counter = 0;

    grid[20][10] = 3;
    grid[10][10] = 5;
    grid[30][10] = 5;
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
    helper();
}

//---------------------------

async function helper(){
    var thisNode;
    var r, c, currR, currC, bob;
    var trueR, trueC;
    var pass = false;
    var indx = 0, indx2 = 0, w = 0;
    var currR, currC;
    var alt = true; //true prioq, false prioq2

    while(indx < prioq.length || indx2 < prioq2.length){
        pass = false;
        if(alt){
            thisNode = prioq[indx];
            r = thisNode.r;
            c = thisNode.c;
            w = weight[r][c];
        }
        else{
            thisNode = prioq2[indx2];
            r = thisNode.r;
            c = thisNode.c;
            w = weight[r][c];
        }

//--------------------------------------------

        for(let i = 0; i < 4; i++){
            currR = r + arrR[i];
            currC = c + arrC[i];
    
            if(check(currR, currC, w) == true){
                if(grid[currR][currC] == 3){
                    trueR = r;
                    trueC = c;
                    indx = prioq.length;
                    indx2 = prioq2.length;
                    break;    
                }
                pass = true;
                grid[currR][currC] = 2;
                adj[currR *numDivY + currC] = r * numDivY + c;
                weight[currR][currC] = w + stepsize[currR][currC];
    
                if(alt){
                    qin(currR, currC, indx, alt)
                }
                else{
                    qin(currR, currC, indx2, alt);
                }
            }
        }

//--------------------------------------------

        if(pass == true){
            bob = await doSetTimeout();
        }
        if(alt){
            indx++;
            alt = !alt;
        }
        else{
            indx2++;
            alt = !alt;
        }
    }

    ending(trueR * numDivY + trueC);
}


//binary search insert
function qin(r, c, ind, alt){
    var w = weight[r][c];
    var low = ind; 
    var high;
    var mid;


    if(alt){
        high = prioq.length - 1;
        mid = Math.floor((low + high)/2);

        if(w > weight[prioq[high].r][prioq[high].c]){
            prioq.push(new Node(r, c));
            return;
        }
        while(low < high){
            if(w == weight[prioq[mid].r][prioq[mid].c]){
                prioq.splice(mid+1, 0, new Node(r,c));
                return;
            }
            else if(w < weight[prioq[mid].r][prioq[mid].c]){
                high = mid;
            }
            else{
                low = mid;
            }
            mid = Math.floor((low + high+1)/2);
        }
        prioq.splice(high+1, 0, new Node(r,c));
    }
    else{
        high = prioq2.length - 1;
        mid = Math.floor((low + high)/2);

        if(w > weight[prioq2[high].r][prioq2[high].c]){
            prioq2.push(new Node(r, c));
            return;
        }
        while(low < high){
            if(w == weight[prioq2[mid].r][prioq2[mid].c]){
                prioq2.splice(mid+1, 0, new Node(r,c));
                return;
            }
            else if(w < weight[prioq2[mid].r][prioq2[mid].c]){
                high = mid;
            }
            else{
                low = mid;
            }
            mid = Math.floor((low + high+1)/2);
        }
        prioq2.splice(high+1, 0, new Node(r,c));
    }

    return;
}









//---------------------------

function doSetTimeout() { 
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(0);
      }, 0);
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
            weight[i][j] = 100000000;
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
    prioq = [];
    prioq2 = [];
    adj[10 * numDivY + 10] = 10 * numDivY + 10;

    prioq.push(new Node(10, 10));
    prioq2.push(new Node(30, 10));
    weight[10][10] = 0;
    weight[30][10] = 0;

    grid[30][10] = 5;//temporarily here
}