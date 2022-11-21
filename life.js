
// this one is sweet
//let SURVIVAL = [];
//let PRODUCES = [1];


// the real one tho i think
//let SURVIVAL = [3,4];
//let PRODUCES = [2];

// alt?
let SURVIVAL = [3];
let PRODUCES = [2];


const LifeState = {
		OFF:'off',
		ON:'on',
		NIL:'nil'
}
Object.freeze(LifeState);

function nextKey(k,fwd=true) {
		switch(k) {
		case LifeState.OFF:
				return fwd? LifeState.ON : LifeState.NIL;
		case LifeState.ON:
				return fwd? LifeState.NIL : LifeState.OFF;
		case LifeState.NIL:
		default:
				return fwd? LifeState.OFF : LifeState.ON;
		}
}

class LifeHex extends Hex {
		constructor(state,q,r,s) {
				super(q,r,s);
				this.state = state;
		}
		clone() {
				return new LifeHex(this.state,this.q,this.r,this.s);
		}
		static fromJSON(o) {
				return new LifeHex(o.state,o.q,o.r);
		}
		drawState(ctx,x,y,sz) {
				switch (this.state) {
				case LifeState.OFF:
						drawHexagon(ctx,x,y,sz,'rgb(0,0,0)');
						break;
				case LifeState.ON:
						drawHexagon(ctx,x,y,sz,'rgb(0,0,255)');
						break;
				case LifeState.NIL:
				default:
						return;
				}
		}
}

class LifeGrid extends Grid {
		constructor() {
				super(LifeHex, LifeState.NIL);
		}
		step() {
				let cellcp = this.cells.map(c=>c.clone());
				function stateAtClone(cl,q,r) {
						let cells = cl.filter(c => c.q==q && c.r==r);
						if(cells.length == 0) return LifeState.OFF;
						return cells[0].state;
				}
				for(var i=0; i<cellcp.length; i++) {
						if(cellcp[i].state != LifeState.NIL) {
								let nbrs = cellcp[i].neighbors();
								let reducefn = (a,b) => {
										let s = stateAtClone(cellcp,b.q,b.r);
										let v = s == LifeState.ON ? 1 : 0;
										return a + v;
								}
								let nbrct = nbrs.reduce(reducefn,0);
								if(cellcp[i].state == LifeState.ON) {
										if(!SURVIVAL.includes(nbrct)) {
												this.cells[i].state = LifeState.OFF;
										}
								}
								if(cellcp[i].state == LifeState.OFF) {
										if(PRODUCES.includes(nbrct)) {
												this.cells[i].state = LifeState.ON;
										}
								}
						}
				}
		}
}

g = new LifeGrid();


function blank(q,r,g) {
		for(let i=0;i<q;i++) {
				for(let j=0;j<r;j++) {
						g.change(LifeState.OFF,i,j);
				}
		}
}
function blankHex(q,r,sz,g) {
		let h = g.copyHex(q,r,sz);
		for(let c of h) {
				g.change(LifeState.OFF,c.q,c.r)
		}
}


function randomize(q,r,g) {
		// puts random elements in the grid
		for(let i=0;i<q;i++) {
				for(let j=0; j<r;j++) {
						let rv = Math.random();
						if(rv < 0.5) {
								g.change(LifeState.OFF,i,j);
						}
						else {
								g.change(LifeState.ON,i,j);
						}
				}
		}
}
