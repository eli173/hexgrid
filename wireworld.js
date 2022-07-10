
const WWState = {
		EMPTY: 'empty',
		OFF: 'off',
		HEAD: 'head',
		TAIL: 'tail'
};
Object.freeze(WWState);

function nextKey(k,fwd=true) {
		switch(k) {
		case WWState.EMPTY:
				return fwd ? WWState.OFF : WWState.TAIL;
		case WWState.OFF:
				return fwd ? WWState.HEAD : WWState.EMPTY;
		case WWState.HEAD:
				return fwd ? WWState.TAIL : WWState.OFF;
		case WWState.TAIL:
		default:
				return fwd ? WWState.EMPTY : WWState.HEAD;
		}
}

class WWHex extends Hex {
		constructor(state,q,r,s) {
				super(q,r,s);
				this.state = state;
		}
		clone() {
				return new WWHex(this.state, this.q, this.r, this.s);
		}
		static fromJSON(o) {
				return new WWHex(o.state, o.q, o.r);
		}
		drawState(ctx, x, y, sz) {
				switch(this.state) {
				case WWState.OFF:
						drawHexagon(ctx,x,y,sz,'rgb(0,0,0)');
						return;
						break;
				case WWState.TAIL:
						drawHexagon(ctx,x,y,sz,'rgb(0,0,255)');
						return;
						break;
				case WWState.HEAD:
						drawHexagon(ctx,x,y,sz,'rgb(255,0,0)');
						return;
						break;
				case WWState.EMPTY:
						return;
						break;
				}
				/*ctx.save();
				switch(this.state) {
				case WWState.OFF:
						ctx.fillStyle = 'rgb(0,0,0)';
						break;
				case WWState.EMPTY:
						ctx.fillStyle = 'rgb(255,255,255)';
						ctx.restore();
						return;
						break;
				case WWState.TAIL:
						ctx.fillStyle = 'rgb(0,0,255)';
						break;
				case WWState.HEAD:
				default:
						ctx.fillStyle = 'rgb(255,0,0)';
						break;
				}
				ctx.beginPath();
				let r = sz * Math.sqrt(3)/2 * 0.9;
				ctx.arc(x,y,r,0,Math.PI*2,true);
				ctx.fill();
				ctx.stroke();
				ctx.restore();*/
		}
};

class WWGrid extends Grid {
		constructor() {
				super(WWHex, WWState.EMPTY);
		}
		step() {
				let cellcp = this.cells.map(c => c.clone());
				// will be in the same order
				for(var i=0; i<cellcp.length; i++) {
						switch(cellcp[i].state) {
						case WWState.HEAD:
								this.cells[i].state = WWState.TAIL;
								break;
						case WWState.TAIL:
								this.cells[i].state = WWState.OFF;
								break;
						case WWState.OFF:
								function stateAtClone(cl,q,r) {
										let cells = cl.filter(c => c.q==q && c.r==r);
										if(cells.length == 0) return WWState.OFF;
										return cells[0].state;
								}
								let nbrs = cellcp[i].neighbors();
								var heads = 0;
								for(var j=0; j<6; j++) {
										var st8 = stateAtClone(cellcp,nbrs[j].q, nbrs[j].r);
										if(st8==WWState.HEAD) heads++;
								}
								if(heads > 0 && heads < 3) {
										this.cells[i].state = WWState.HEAD;
								}
								break;
						case WWState.EMPTY:
						default:
								break;
						}
				}
		}
}

g = new WWGrid();
