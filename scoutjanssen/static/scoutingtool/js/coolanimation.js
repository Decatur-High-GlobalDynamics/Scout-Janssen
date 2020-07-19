var c = document.createElement("canvas");
document.body.append(c);
document.body.style.margin = "0px";

c.height = window.innerHeight;
c.width = window.innerWidth;

c.style.zIndex = -999999;
c.style.position = "fixed";
var sx = c.width;
var sy = c.height;

var ctx = c.getContext("2d");

var points = [];

var speed = 2;

for(var i = 0; i < 8; i++){
    points[i] = [Math.random() * sx, Math.random() * sy, Math.random() - 0.5, Math.random() - 0.5, rc()];
}

setInterval(update, 1000 / 60);

document.body.style.backgroundColor = "black";
ctx.strokeStyle = "cyan";

function update(){
    ctx.clearRect(0, 0, sx, sy);
    for(i of points){
        for(j of points){
            ctx.strokeStyle = "rgb(" + ac(i, j) + ")";
            //console.log("rgb(" + ac(i, j) + ")");
            ctx.beginPath();
            ctx.moveTo(i[0], i[1]);
            ctx.lineTo(j[0], j[1]);
            ctx.stroke();
            ctx.closePath();
        }
    }
    for(i in points){
        points[i][0] += points[i][2] * speed;
        points[i][1] += points[i][3] * speed;
        if(points[i][0] > sx || points[i][0] < 0){
            points[i][2] *= -1;
        }
        if(points[i][1] > sy || points[i][1] < 0){
            points[i][3] *= -1;
        }
    }
}

function ac(a, b){
    return Math.floor((a[4][0] + b[4][0]) / 2) + ", " + Math.floor((a[4][1] + b[4][1]) / 2) + ", " + Math.floor((a[4][2] + b[4][2]) / 2);
}

function rc(){
    return [0, (Math.random() * 155) + 100, (Math.random() * 155) + 100];
}