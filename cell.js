
// do i want to fret over rotation? not yet


class Hex {
		// cubic coords, stored axially
		// ref: https://www.redblobgames.com/grids/hexagons/
		constructor(q,r,s) {
				if(typeof s == "undefined") {
						s = -q-r;
				}
				if(q+r+s !=0) {
						throw("invalid coords")
				}
				this.q = q;
				this.r = r;
		}
		get s() {
				return -this.q-this.r;
		}
		clone() {
				return new Hex(this.q, this.r);
		}
		
		neighbors() {
				var arr = [];
				for(var i=0; i<6; i++) {
						arr.push(this.clone());
				}
				arr[0].q -= 1;
				arr[1].q += 1;
				arr[2].q += 1;
				arr[2].r -= 1;
				arr[3].q -= 1;
				arr[3].r += 1;
				arr[4].r -= 1;
				arr[5].r += 1;
				return arr;
		}


		// methods for being displayed I guess
		getCanvasCoords(xorig, yorig, scale) {
				// x,y is origin place, scale is how much to multiply unit dist by
				var xi = 0;
				var yi = 0;
				// ispoint determines ^ or _ for how they look on top
				/*if(ispoint) {*/
				xi = scale * (Math.sqrt(3)*this.q+Math.sqrt(3)*this.r/2);
				yi = scale * (this.r*3/2);
				/*}
				else {
						xi = scale * (this.q*3/2);
						yi = scale * (Math.sqrt(3)*this.q/2+Math.sqrt(3)*this.r);
				}*/
				return {x: xi+xorig, y: yi+yorig}
		}



		rotate(q,r, ccw=true) {
				// rotates (ccw default) about the q,r points given
				var retitem = this.clone();
				var trq = q-this.q;
				var trr = r-this.r;
				var trs = -trq-trr;
				var rq = ccw ? -trs : -trr;
				var rr = ccw ? -trq : -trs;
				retitem.q = q+rq;
				retitem.r = r+rr;
				return retitem;
		}
		refl(q,r) {
				var ret = this.clone();
				var trq = q-this.q;
				var trr = r-this.r;
				var trs = -trq-trr;
				ret.q = -trs + q;
				return ret;
		}
		flip(q,r) {
				// flips about point
				var ret = this.clone();
				let dq = q-this.q;
				let dr = r-this.r;
				ret.q = q + dq;
				ret.r = r + dr;
				return ret;
		}
		
}

/*
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
*/



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
