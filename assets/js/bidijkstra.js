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
var last_state = 0;
var ismoving;
var isfinding = false;   
var startr, startc, endr, endc;

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

    startr = 10, startc = 10;
    endr = 30, endc = 10;

    grid[startr][startc] = 5;
    grid[endr][endc] = 5;
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

    if(grid[i][j] == 0) ismoving = 1;
    if(grid[i][j] == 5) ismoving = 5;
    if(i == endr && j == endc) ismoving = 6;
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
        else if(ismoving == 6){
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
            grid[i][j] = 5;
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
    helper();
}

//---------------------------

async function helper(){
    var thisNode;
    var r, c, currR, currC, bob;
    var trueR, trueC;
    var trueR2, trueC2;
    var pass = false;
    var indx = 0, indx2 = 0, w = 0;
    var currR, currC;
    var alt = true; //true prioq, false prioq2

    while(indx < prioq.length || indx2 < prioq2.length){
        pass = false;
        if(alt){
            if(indx >= prioq.length){
                alt = !alt;
                continue;
            }
            thisNode = prioq[indx];
            r = thisNode.r;
            c = thisNode.c;
            w = weight[r][c];
        }
        else{
            if(indx2 >= prioq2.length){
                alt = !alt;
                continue;
            }
            thisNode = prioq2[indx2];
            r = thisNode.r;
            c = thisNode.c;
            w = weight[r][c];
        }

//--------------------------------------------

        for(let i = 0; i < 4; i++){
            currR = r + arrR[i];
            currC = c + arrC[i];
    
            if(check(currR, currC, w, alt) == true){
                if(alt){
                    if(grid[currR][currC] == 3){
                        trueR = r;
                        trueC = c;
                        trueR2 = currR;
                        trueC2 = currC;
                        indx = prioq.length;
                        indx2 = prioq2.length;
                        console.log(trueR + " " + trueC);
                        console.log(trueR2 + " " + trueC2);
                        break;  
                    }
                    adj[currR *numDivY + currC] = r * numDivY + c;
                    grid[currR][currC] = 2;

                    pass = true;
                    weight[currR][currC] = w + stepsize[currR][currC];
                    qin(currR, currC, indx, alt)
                }
                else{
                    if(grid[currR][currC] == 2){
                        trueR2 = r;
                        trueC2 = c;
                        trueR = currR;
                        trueC = currC;
                        indx = prioq.length;
                        indx2 = prioq2.length;
                        console.log(trueR2 + " " + trueC2);
                        break;  
                    }
                    grid[currR][currC] = 3;
                    adj[currR *numDivY + currC] = r * numDivY + c;
                    pass = true;
                    weight[currR][currC] = w + stepsize[currR][currC];
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

    ending(trueR * numDivY + trueC, trueR2 * numDivY + trueC2);
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

  function check(r, c, w, alt){
    if(r < 0 || r >= numDiv || c < 0 || c >= numDivY){
        return false;
    }

    if(alt){
        if(grid[r][c] == 0){
            if(w + stepsize[r][c] < weight[r][c]){
                return true
            }
            return false;
        }
        else if(grid[r][c] == 3){
            return true;
        }
        return false;
    }
    else{
        if(grid[r][c] == 0){
            if(w + stepsize[r][c] < weight[r][c]){
                return true
            }
            return false;
        }
        else if(grid[r][c] == 2){
            return true;
        }
        return false;
    }
}

async function ending(num, num2){
    var r, c, bob, alt = true;

    while(adj[num] != num || adj[num2] != num2){
        if(alt)
        {
            r = Math.floor(num/numDivY);
            c = num % numDivY;
            grid[r][c] = 4;
            num = adj[num];
            bob = await doSetTimeoutFin();
            alt = !alt;
        }
        else{
            r = Math.floor(num2/numDivY);
            c = num2 % numDivY;
            grid[r][c] = 4;
            num2 = adj[num2];
            bob = await doSetTimeoutFin();
            alt = !alt;
        }
    }
    grid[endr][endc] = 5;//temporarily here
    grid[startr][startc] = 5;//temporarily here

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
            if(num == 2 || num == 4 || num == 3){
                grid[i][j] = 0;
                ctx.fillStyle = "#fff";
                ctx.fillRect(i * dim/numDiv, j * dim/numDiv, dim/numDiv, dim/numDiv);
            }
        }
    }
    prioq = [];
    prioq2 = [];
    adj[startr * numDivY + startc] = startr * numDivY + startc;
    adj[endr * numDivY + endc] = endr * numDivY + endc;

    prioq.push(new Node(startr, startc));
    prioq2.push(new Node(endr, endc));
    weight[startr][startc] = 0;
    weight[endr][endc] = 0;

    grid[endr][endc] = 5;//temporarily here
    grid[startr][startc] = 5;//temporarily here
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