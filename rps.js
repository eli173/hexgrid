// rps automata, seen via https://twitter.com/matthen2/status/1543226575604355072?s=20&t=a35j4jJSqZ6gY8BjybAFDw

let NEIGHBOR_LIMIT = 2;

const RPSState = {
		OFF: 'off',
		ROCK: 'rock',
		PAPER: 'paper',
		SCISSORS:'scissors'
}
Object.freeze(RPSState);

function nextKey(k,fwd=true) {
		switch(k) {
		case RPSState.OFF:
				return fwd? RPSState.ROCK : RPSState.SCISSORS;
		case RPSState.ROCK:
				return fwd? RPSState.PAPER: RPSState.OFF;
		case RPSState.PAPER:
				return fwd? RPSState.SCISSORS : RPSState.ROCK;
		case RPSState.SCISSORS:
		default:
				return fwd? RPSState.OFF : RPSState.PAPER;
		}
}

class RPSHex extends Hex {
		constructor(state,q,r,s) {
				super(q,r,s);
				this.state = state;
		}
		clone() {
				return new RPSHex(this.state,this.q,this.r,this.s);
		}
		static fromJSON(o) {
				return new RPSHex(o.state, o.q, o.r);
		}
		drawState(ctx,x,y,sz) {
				switch(this.state) {
				case RPSState.ROCK:
						drawHexagon(ctx,x,y,sz,'rgb(255,0,0)');
						break;
				case RPSState.PAPER:
						drawHexagon(ctx,x,y,sz,'rgb(0,255,0)');
						break;
				case RPSState.SCISSORS:
						drawHexagon(ctx,x,y,sz,'rgb(0,0,255)');
						break;
				case RPSState.OFF:
				default:
						return;
				}
		}
		drawStateBad(ctx, x, y, sz) {
				ctx.save();
				switch(this.state) {
				case RPSState.OFF:
						ctx.fillStyle = 'rgb(0,0,0)';
						ctx.restore();
						return;
						break;
				case RPSState.ROCK:
						ctx.fillStyle = 'rgb(255,0,0)';
						break;
				case RPSState.PAPER:
						ctx.fillStyle = 'rgb(0,255,0)';
						break;
				case RPSState.SCISSORS:
				default:
						ctx.fillStyle = 'rgb(0,0,255)';
						break;
				}
				ctx.beginPath();
				let r = sz * Math.sqrt(3)/2 * 0.9;
				ctx.arc(x,y,r,0,Math.PI*2,true);
				ctx.fill();
				ctx.stroke();
				ctx.restore();
		}
};

class RPSGrid extends Grid {
		constructor() {
				super(RPSHex, RPSState.OFF);
		}
		step() {
				let cellcp = this.cells.map(c=>c.clone());
				function stateAtClone(cl,q,r) {
						let cells = cl.filter(c => c.q==q && c.r==r);
						if(cells.length == 0) return RPSState.OFF;
						return cells[0].state;
				}
				for(var i=0; i<cellcp.length;i++) {
						//console.log(i);
						let nbrs = cellcp[i].neighbors();
						switch(cellcp[i].state) {
						case RPSState.ROCK:
								var papers = 0;
								for(var j=0;j<6;j++) {
										var st8 = stateAtClone(cellcp, nbrs[j].q, nbrs[j].r);
										if(st8 == RPSState.PAPER) papers++;
										//console.log(st8);
								}
								if(papers >= NEIGHBOR_LIMIT) {
										this.cells[i].state = RPSState.PAPER;
								}
								break;
						case RPSState.PAPER:
								var scissors = 0;
								for(var j=0;j<6;j++) {
										var st8 = stateAtClone(cellcp, nbrs[j].q, nbrs[j].r);
										if(st8 == RPSState.SCISSORS) scissors++;
								}
								if(scissors >= NEIGHBOR_LIMIT) {
										this.cells[i].state = RPSState.SCISSORS;
								}
								break;
						case RPSState.SCISSORS:
								var rocks = 0;
								for(var j=0;j<6;j++) {
										var st8 = stateAtClone(cellcp, nbrs[j].q, nbrs[j].r);
										if(st8 == RPSState.ROCK) rocks++;
								}
								if(rocks >= NEIGHBOR_LIMIT) {
										this.cells[i].state = RPSState.ROCK;
								}
								break;
						case RPSState.OFF:
						default:
								break;
						}
				}
		}
}

g = new RPSGrid();


function randomize(q,r,g) {
		// puts random elements in the grid
		for(let i=0;i<q;i++) {
				for(let j=0; j<r;j++) {
						let rv = Math.floor(Math.random()*3);
						if(rv < 1) {
								g.change(RPSState.ROCK,i,j);
						}
						else if(rv<2) {
								g.change(RPSState.PAPER,i,j);
						}
						else {
								g.change(RPSState.SCISSORS,i,j);
						}
				}
		}
}
