

class Grid {
		constructor(cellclass=null, defaultstate=null) {
				this.cclass = cellclass;
				this.defaultstate = defaultstate;
				this.cells = [];
		}
		clean() {
				this.cells = this.cells.filter(x=>x.state!=this.defaultstate);
		}
		clone() {
				let ng = new this.constructor(this.cellclass, this.defaultstate);
				for(let i of this.cells) {
						ng.cells.push(i.clone())
				}
				return ng;
		}
		exportState() {
				this.clean();
				return JSON.stringify(this.cells);
		}
		loadState(str) {
				let obj = JSON.parse(str);
				if(!Array.isArray(obj)) return;
				this.cells = [];
				for(let i of obj) {
						this.cells.push(this.cclass.fromJSON(i));
				}
		}

		change(state,q,r) {
				let cells = this.cells.filter(c => c.q==q && c.r==r);
				if(cells.length == 0) {
						this.cells.push(new this.cclass(state,q,r));
				}
				else {
						cells[0].state = state;
				}
		}
		cellAt(q,r) {
				let cells = this.cells.filter(c => c.q==q && c.r==r);
				if(cells.length == 0) return new this.cclass(this.defaultstate,q,r);
				return cells[0];
		}
		stateAt(q,r) {
				return this.cellAt(q,r).state;
		}
		
		/*step() {
				
		}*/
		
		rotateGrid(q,r,ccw=true) {
				let cells2 = this.cells.map((c)=>c.rotate(q,r,ccw));
				this.cells = cells2;
		}
		getHex(q,r,radius) {
				var rcells = [this.cellAt(q,r)];
				for(let i=1; i<radius; i++) {
						var currcell = this.cellAt(q,r+i);
						for(let j=0; j<6; j++) {
								let dirv = null;
								switch(j) {
								case 0:
										dirv = {q: 1, r:-1};
										break;
								case 1:
										dirv = {q: 0, r:-1};
										break;
								case 2:
										dirv = {q:-1, r: 0};
										break;
								case 3:
										dirv = {q:-1, r: 1};
										break;
								case 4:
										dirv = {q: 0, r: 1};
										break;
								case 5:
										dirv = {q: 1, r: 0};
										break;
								}
								for(let k=0; k<i; k++) {
										rcells.push(currcell);
										currcell = this.cellAt(currcell.q + dirv.q, currcell.r + dirv.r);
								}
						}
				}
				return rcells;
		}
		reflHex(q,r,radius) {
				let rcells = this.getHex(q,r,radius);
				let newcells = rcells.map(x=>x.refl(q,r));
				for(let i of newcells) {
						this.change(i.state, i.q, i.r);
				}
				this.clean();
		}
		flipHex(q,r,radius) {
				let rcells = this.getHex(q,r,radius);
				let newcells = rcells.map(x=>x.flip(q,r));
				//this.cells = newcells;
				for(let i of newcells) {
						this.change(i.state, i.q, i.r);
				}
				this.clean();

		}
		
		rotateHex(q,r,radius,ccw=true) {
				let rcells = this.getHex(q,r,radius);
				let newcells = rcells.map(x=>x.rotate(q,r));
				//this.cells = newcells;
				for(let i of newcells) {
						this.change(i.state, i.q, i.r);
				}
				this.clean();
		}
		
		copyHex(q,r,radius) {
				var first = this.cellAt(q,r).clone();
				first.q = 0;
				first.r = 0;
				var rcells = [];
				rcells.push(first);
				for(let i=1; i<radius; i++) {
						var currcell = this.cellAt(q,r+i);
						for(let j=0; j<6; j++) {
								let dirv = null;
								switch(j) {
								case 0:
										dirv = {q: 1, r:-1};
										break;
								case 1:
										dirv = {q: 0, r:-1};
										break;
								case 2:
										dirv = {q:-1, r: 0};
										break;
								case 3:
										dirv = {q:-1, r: 1};
										break;
								case 4:
										dirv = {q: 0, r: 1};
										break;
								case 5:
										dirv = {q: 1, r: 0};
										break;
								}
								for(let k=0; k<i; k++) {
										let clone = currcell.clone()
										clone.q = currcell.q - q;
										clone.r = currcell.r - r;
										rcells.push(clone);
										currcell = this.cellAt(currcell.q + dirv.q, currcell.r + dirv.r);
								}
						}								
				}
				return rcells;
		}
		pasteHex(q,r,buf) {
				for(let i of buf) {
						let cp = i.clone(); // so that one can paste multiple times
						this.change(cp.state, cp.q+q, cp.r+r);
				}
		}


		// still experimental, not a clear way to properly utilise yet
		getLine(idx, dir) {
				// idx is the index, i.e. 6 in r=6
				// dir is in {q,r,s}
				var theline = [];
				for(let i of this.cells) {
						if(i[dir] == idx) theline.push(i);
				}
				return theline;
		}
		pasteLine(q,r,dir,buf) {
				let idx = (new Hex(q,r))[dir];
				for(let i of this.cells) {
						if(i[dir] == idx) i.state = this.defaultstate;
				}
				for(let i in buf) {
						let cp = i.clone();
						this.change(cp.state,cp.q,cp.r);
				}
		}
}


function drawGrid(g, ctx, xc, yc, scl) {
		ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
		for(let i of g.cells) {
				coords = i.getCanvasCoords(xc,yc,scl);
				i.drawState(ctx,coords.x,coords.y,scl);
		}
}


function gonclick(g,c,ctx,grid,xc,yc,scl,evt) {
		//console.log(evt);
		let rqcoord = getClickCoords(c, scl, xc, yc, evt);
		let currst8 = g.stateAt(rqcoord.q, rqcoord.r);
		let nextst8 = nextKey(currst8);
		grid.change(nextst8, rqcoord.q, rqcoord.r);
		drawGrid(g, ctx, xc, yc, scl);
}
function gonrclick(g,c,ctx,grid,xc,yc,scl,evt) {
		//console.log(evt);
		let rqcoord = getClickCoords(c, scl, xc, yc, evt);
		let currst8 = g.stateAt(rqcoord.q, rqcoord.r);
		let nextst8 = nextKey(currst8,false);
		grid.change(nextst8, rqcoord.q, rqcoord.r);
		drawGrid(g, ctx, xc, yc, scl);
}
