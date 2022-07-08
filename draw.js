

DRAWHEX_RAD_SCALE = 1.18;

function drawHexagon(ctx,x,y,sz,color) {
		ctx.save();
		ctx.strokeStyle=color;
		ctx.fillStyle=color;
		ctx.beginPath();
		let r = sz * Math.sqrt(3)/2 * DRAWHEX_RAD_SCALE;
		for(let i=0; i<=6;i++) {
				let ang = Math.PI/6 + i*Math.PI/3;
				let ix = x + r * Math.cos(ang);
				let iy = y + r * Math.sin(ang);
				ctx.lineTo(ix,iy);
		}
		ctx.fill();
		ctx.restore();
}
