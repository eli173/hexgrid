


const BState = {
		DEF: 'default',
		SND: 'second',
		MRE: 'more'
};
Object.freeze(BState);

function nextKey(k, fwd=true) {
		switch(k) {
		case BState.DEF:
				return fwd ? BState.SND : BState.MRE;
		case BState.SND:
				return fwd ? BState.MRE : BState.DEF;
		case BState.MRE:
		default:
				return fwd ? BState.DEF : BState.SND;
		}
}


class BasicHex extends Hex {
		constructor(state,q,r,s) {
				super(q,r,s);
				this.state = state;
		}
		clone() {
				return new BasicHex(this.state, this.q, this.r, this.s);
		}
		static fromJSON(o) {
				return new BasicHex(o.state,o.q,o.r);
		}
		drawState(ctx, x, y, sz) {
				ctx.save();
				switch(this.state) {
				case BState.SND:
						ctx.fillStyle = 'rgb(255,0,0)';
						break;
				case BState.MRE:
						ctx.fillStyle = 'rgb(0,0,255)';
						break;
				default:
						//ctx.fillStyle = 'rgb(0,0,0)';
						//break;
						ctx.restore();
						return;
				}
				ctx.beginPath();
				let r = sz * Math.sqrt(3)/2 * 0.9;
				ctx.arc(x,y,r,0,Math.PI*2,true);
				ctx.fill();
				ctx.stroke();
				ctx.restore();
		}
}

class BasicGrid extends Grid {
		constructor() {
				super(BasicHex, BState.DEF);
		}
		step() {
				for(let i of this.cells) {
						if(i.state == BState.SND) i.state = BState.MRE;
						else if(i.state == BState.MRE) i.state = BState.SND;
				}
		}
}

g = new BasicGrid();
