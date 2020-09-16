"use strict";
function isPointing_atPie(x, y) {
    //console.log('hi');
    //console.log(`calculating point at pie for: ${x}, ${y}`);
    //console.log(`is: ${y} > ${pie_y} ?`);
    if (y < pie_y) {
        return false;
    }
    //console.log('passed 1st');
    if (y > (pie_y + pie_height)) {
        return false;
    }
    //console.log('passed 2nd');
    if (x < pie_x) {
        return false;
    }
    //console.log('passed 3rd');
    if (x > (pie_x + pie_width)) {
        return false;
    }
    // now we now mouse is over image, still need to determine wheter it points at pie
    let dist_x = Math.abs(x - centerX);
    let dist_y = Math.abs(y - centerY);
    let inner = Math.pow(dist_x, 2) + Math.pow(dist_y, 2);
    let dist = Math.pow(inner, 0.5);
    if (dist > radius || dist < innerCircle) {
        return false;
    }
    console.log("I am pointing at pie image!");
    return true;
}
function is_at_middlePie(x, y) {
    if (y < pie_y) {
        return false;
    }
    if (y > (pie_y + pie_height)) {
        return false;
    }
    if (x < pie_x) {
        return false;
    }
    if (x > (pie_x + pie_width)) {
        return false;
    }
    // now we now mouse is over image, still need to determine wheter it points at pie
    let dist_x = Math.abs(x - centerX);
    let dist_y = Math.abs(y - centerY);
    let inner = Math.pow(dist_x, 2) + Math.pow(dist_y, 2);
    let dist = Math.pow(inner, 0.5);
    if (dist > innerCircle) {
        return false;
    }
    console.log("We are in the middle!");
    return true;
}
function calc_Sector(x, y) {
    let dist_x = x - centerX;
    let dist_y = y - centerY;
    let deg = calc_angle_from_origin(dist_x, dist_y);
    console.log(`degree: ${deg}`);
    let sector = Math.floor(deg / 45) + 1;
    console.log(`sector: ${sector}`);
    return sector;
}
function calc_angle_from_origin(x, y) {
    let radian = Math.atan2(y, x);
    let degs = radian * 180 / Math.PI; // rads to degs, range (-180, 180]
    if (degs < 0)
        degs = 360 + degs; // range [0, 360)
    // now since my pie begins at top : 270 deg, add 90 to all and for those over 360 subs 360
    degs += 90;
    if (degs > 360) {
        degs -= 360;
    }
    return degs;
}
/*function angle(cx, cy, ex, ey) {
  var dy = ey - cy; var dx = ex - cx; var theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}*/
var mouseX;
var mouseY;
var highlighted = new Array(10);
for (let i = 0; i < 10; ++i)
    highlighted[i] = false;
var pie_style = getComputedStyle(document.getElementById("rainbow_pie"));
var pie_x = parseInt(pie_style.left, 10);
var pie_y = parseInt(pie_style.top, 10);
var pie_width = parseInt(pie_style.width, 10);
var pie_height = parseInt(pie_style.height, 10);
var centerX = pie_x + pie_width / 2;
var centerY = pie_y + pie_height / 2;
var radius = pie_width / 2;
var innerCircle = 102;
console.log("Hello world!");
console.log(pie_style);
console.log(pie_x);
console.log(pie_y);
console.log(pie_width);
console.log(pie_height);
document.addEventListener("mousedown", ev => {
    console.log(`Mouse clicked at ${ev.x}, ${ev.y}`);
    if (highlighted[1]) {
        window.location.href = "./scitani_a_odcitani/+-.html";
    }
});
document.addEventListener("mousemove", ev => {
    mouseX = ev.x;
    mouseY = ev.y;
    if (isPointing_atPie(mouseX, mouseY)) {
        // calculate which part of pie do we point at and highlight it
        let sector = calc_Sector(mouseX, mouseY);
        // always only do the job on changing the sector, dont set it again and again. 
        if (!highlighted[sector]) {
            // set opacity of all to 0 and then set opacity of sector to 1;
            for (let i = 1; i < 9; ++i) {
                let el = document.getElementById(`pie${i}`);
                el.style.opacity = "0";
                highlighted[i] = false;
            }
            let el = document.getElementById(`pie${sector}`);
            el.style.opacity = "1";
            highlighted[sector] = true;
            document.body.style.cursor = "pointer";
            highlighted[0] = true;
        }
    }
    else {
        if (highlighted[0]) {
            // if we are in the middle of pie let things be, other wise we are outside for the first time
            // in such case set highlighted[0] to false and make opacity for all to 0
            if (!is_at_middlePie(mouseX, mouseY)) {
                for (let i = 1; i < 9; ++i) {
                    let el = document.getElementById(`pie${i}`);
                    el.style.opacity = "0";
                    highlighted[i] = false;
                }
                document.body.style.cursor = "default";
                highlighted[0] = false;
            }
        }
    }
});
