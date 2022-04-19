


var g = null; // must be set elsewhere before using anything in here
copybuf = [];

//params
xcenter = 200
ycenter = 200
scale = 10



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
		c.onmousedown = e=>mousedownshell(g,c,ctx,xcenter,ycenter,scale,e);
		c.onmouseup = e=>mouseup(c);
		c.oncontextmenu = (e)=>e.preventDefault();
		drawGrid(g, ctx, xcenter,ycenter,scale);
		document.addEventListener('keydown', e=>{
				if(e.key == "p") pptoggle(e);
				if(e.key == "s") {g.step();drawGrid(g,ctx,xcenter,ycenter,scale);}
				if(e.key == "r") {g=rstgrid.clone(); drawGrid(g, ctx, xcenter,ycenter,scale)}
		});
		step = document.getElementById('step');
		step.addEventListener('click', function(e){g.step();drawGrid(g,ctx,xcenter,ycenter,scale);})
		playbtn = document.getElementById('playpause');
		playbtn.addEventListener('click',pptoggle);
		range = document.getElementById("tempo");
		range.onclick = (e) => rangeManage(e);
		clr = document.getElementById("clear");
		clr.onclick = () => {g.cells = [];
														 drawGrid(g, ctx, xcenter,ycenter,scale)};
		rst = document.getElementById("reset");
		rst.onclick = () => {g=rstgrid.clone(); drawGrid(g, ctx, xcenter,ycenter,scale)};
		es = document.getElementById("es");
		es.onclick = exportState;
		is = document.getElementById("is");
		is.onclick = importState;
		rb = document.getElementById("rot");
		rb.onclick = rotateButtonHandler;
		cp = document.getElementById("copy");
		cp.onclick = copyHandler;
		ps = document.getElementById("paste");
		ps.onclick = pasteHandler;
		sv = document.getElementById("save");
		sv.onclick = saveState;
		ld = document.getElementById("load");
		ld.onclick = loadState;
		fl = document.getElementById("flp");
		fl.onclick = flipButtonHandler;
		rf = document.getElementById("rfl");
		rf.onclick = reflectButtonHandler;
}

radius_hover = function(e) {
		let rad = parseInt(document.getElementById('rad').value);
		let gcoord = getClickCoords(c,scale,xcenter,ycenter,e);
		let cell = g.cellAt(gcoord.q, gcoord.r);
		// does this belong here? maybe it's okay...
		let ccoords = cell.getCanvasCoords(xcenter, ycenter, scale);
		drawGrid(g, ctx, xcenter,ycenter,scale);
		ctx.save();
		ctx.fillStyle = "rgba(0.3,0.3,0.3,0.1)";
		ctx.strokeStyle = "rgba(0.3,0.3,0.3,0.1)";
		let r = (rad-.5) * scale * Math.sqrt(3);
		let x = ccoords.x;
		let y = ccoords.y;
		ctx.beginPath();
		ctx.moveTo(x+r,y);
		for(let i=1; i<7; i++) {
				ctx.lineTo(x+ r*Math.cos(Math.PI*i/3), y+r*Math.sin(Math.PI*i/3));
		}
		ctx.fill();
		ctx.stroke();
		ctx.restore();
}

rangeManage = function(e) {
		timeout = document.getElementById('tempo').value;
		if(intervalID != null) { // is running
				clearInterval(intervalID);
				intervalID = setInterval(play,timeout);
				// playbtn already set right
		}
}

saveState = function(e) {
		let slot = document.getElementById("slot").value;
		let val = g.exportState();
		localStorage.setItem(slot, val);
}
loadState = function(e) {
		let slot = document.getElementById("slot").value;
		let res = localStorage.getItem(slot);
		if(res == null) {
				g.loadState("[]");
				drawGrid(g, ctx, xcenter,ycenter,scale);
		}
		g.loadState(res);
		drawGrid(g, ctx, xcenter,ycenter,scale);
}


pptoggle = function(e) {
		timeout = document.getElementById('tempo').value;
		if(intervalID == null) {
				g.clean();
				rstgrid = g.clone();
				intervalID = setInterval(play, timeout);
				playbtn.value = "pause";
		}
		else {
				clearInterval(intervalID);
				intervalID = null;
				playbtn.value = "play";
		}
};

reflectButtonHandler = function(e) {
		c.onclick =  e=>reflectThingy(e);
		c.addEventListener('mousemove', radius_hover);
}
reflectThingy = function(evt) {
		c.removeEventListener('mousemove', radius_hover);
		let coords = getClickCoords(c,scale,xcenter,ycenter,evt);
		let rad = parseInt(document.getElementById('rad').value);
		g.reflHex(coords.q,coords.r,rad);
		drawGrid(g, ctx, xcenter,ycenter,scale);
		c.onclick = null;
}
flipButtonHandler = function(e) {
		c.onclick =  e=>flipThingy(e);
		c.addEventListener('mousemove', radius_hover);
}
flipThingy = function(evt) {
		c.removeEventListener('mousemove', radius_hover);
		let coords = getClickCoords(c,scale,xcenter,ycenter,evt);
		let rad = parseInt(document.getElementById('rad').value);
		g.flipHex(coords.q,coords.r,rad);
		drawGrid(g, ctx, xcenter,ycenter,scale);
		c.onclick = null;
}
rotateButtonHandler = function(e) {
		c.onclick =  e=>rotateThingy(e);
		c.addEventListener('mousemove', radius_hover);
}
rotateThingy = function(evt) {
		c.removeEventListener('mousemove', radius_hover);
		let coords = getClickCoords(c,scale,xcenter,ycenter,evt);
		let rad = parseInt(document.getElementById('rad').value);
		g.rotateHex(coords.q,coords.r,rad);
		drawGrid(g, ctx, xcenter,ycenter,scale);
		c.onclick = null;
}

copyHandler = function(e) {
		c.onclick = e=>copyhex(e);
		c.addEventListener('mousemove', radius_hover);
}
copyhex = function(evt) {
		c.removeEventListener('mousemove', radius_hover);
		let coords = getClickCoords(c,scale,xcenter,ycenter,evt);
		let rad = parseInt(document.getElementById('rad').value);
		copybuf = g.copyHex(coords.q, coords.r, rad)
		drawGrid(g, ctx, xcenter,ycenter,scale);
		c.onclick = null;
}
pasteHandler = function(e) {
		c.onclick = e=>pastehex(e);
		c.addEventListener('mousemove', radius_hover);
		ctx.save();
		ctx.fillStyle="rgba(0.4,0.4,0.4,0.1)"
		ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
		ctx.restore();
}
pastehex = function(evt) {
		c.removeEventListener('mousemove', radius_hover);
		let coords = getClickCoords(c,scale,xcenter,ycenter,evt);
		let rad = parseInt(document.getElementById('rad').value);
		g.pasteHex(coords.q,coords.r,copybuf);
		drawGrid(g, ctx, xcenter,ycenter,scale);
		c.onclick = null;
}

exportState = function() {
		let s = g.exportState();
		deets = document.getElementById("outzone");
		deets.innerText = s
}
importState = function() {
		let s = prompt("paste state string below");
		g.loadState(s);
		drawGrid(g, ctx, xcenter,ycenter,scale);		
}

function getClickCoords(c, scale, xoff, yoff, event) {
		let rect = c.getBoundingClientRect();
		// origin points modulo page placement
		let ox = event.clientX - rect.left;
		let oy = event.clientY - rect.top;

		let dfox = (ox - xoff)/scale;
		let dfoy = (oy - yoff)/scale;

		// in basis r,q:
		// [1 0] ->xy [  rt(3)    0  ]
		// [0 1] ->xy [ rt(3)/2  3/2 ]
		// [ r3 r3/2 |  1   0 ]
		// [ 0  3/2  |  0   1 ] //
		// [ 1 1/2 | 1/r3  0  ]
		// [ 0  1  |  0   2/3 ]
		// [ 1 0 | 1/r3 -1/3 ]
		// [ 0 1 |  0   2/3  ]

		preq = dfox*1/Math.sqrt(3) - dfoy*1/3;
		prer = dfoy*2/3;
		r = Math.round(prer);
		q = Math.round(preq);
		return {r: r, q: q};
}


var mmLatestSpot = null;
function mouseMover(g,c,ctx,xc,yc,scl,isLClick,evt) {
		return function(evt) {
				let rqcoord = getClickCoords(c,scl,xc,yc,evt);
				if(rqcoord.q == mmLatestSpot.q && rqcoord.r == mmLatestSpot.r) {
						return;
				}
				mmLatestSpot = rqcoord;
				let currst8 = g.stateAt(rqcoord.q, rqcoord.r);
				let nextst8 = nextKey(currst8,isLClick);
				g.change(nextst8, rqcoord.q, rqcoord.r);
				drawGrid(g, ctx, xc, yc, scl);
		}
}

var currmovefn = null;
function mousedownshell(g,c,ctx,xc,yc,scl,evt) {
		evt.preventDefault();
		let islclick = evt.button == 0;
		currmovefn = mouseMover(g,c,ctx,xc,yc,scl,islclick,evt);
		c.addEventListener('mousemove', currmovefn);
		let rqcoord = getClickCoords(c,scl,xc,yc,evt);
		mmLatestSpot = rqcoord;
		let currst8 = g.stateAt(rqcoord.q, rqcoord.r);
		let nextst8 = nextKey(currst8,islclick);
		g.change(nextst8, rqcoord.q, rqcoord.r);
		drawGrid(g, ctx, xc, yc, scl);
}
function mouseup(c) {
		c.removeEventListener('mousemove',currmovefn);
}
