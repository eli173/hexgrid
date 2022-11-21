


var g = null; // must be set elsewhere before using anything in here

//params
xcenter = 200/2
ycenter = 200/2
scale = 5

var ctx = null;
var c = null;

var timeout = 200;
var rstgrid = g;
var intervalID = null;


function play() {
		g.step();
		drawGrid(g, ctx, xcenter,ycenter,scale);
}
function lc() {
		c = document.getElementById('c');
		ctx = c.getContext('2d');
		randHex(5,5,12,g,0.6);
		drawGrid(g, ctx, xcenter,ycenter,scale);
		b = document.getElementById('refr');
		b.onclick = refresh;
}
function refresh() {
		randHex(5,5,12,g,0.5);
}
