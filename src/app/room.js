"use strict"

import {rect} from '../core/rect.js';

//TODO: Do this right... add it to the core!.
class point {
	constructor(_x, _y) {
		this.x=_x;
		this.y=_y;
	}
};

//TODO: Do this right.
export class draw_tile {
	constructor(_x, _y, _t) {
		this.x=_x;
		this.y=_y;
		this.type=_t;
	}
};

export class tile {
	constructor(_x, _y, _t) {
		//TODO: Magic numbers??
		this.position=new rect(_x*32, _y*32, 32, 32);
		this.type=_t;
	}
};

export class room {

	constructor() {

		this.w=10;
		this.h=6;

//TODO: Fuck this!.
		let tiles_arr=[
0,0,0,0,0,0,0,0,0,1,
0,0,0,0,0,0,0,0,0,1,
1,1,1,0,0,1,1,1,0,1,
1,0,0,0,0,0,0,1,0,1,
1,0,0,0,0,0,0,0,0,1,
1,0,0,0,0,1,1,1,1,1,
];

		this.tiles=[];
		//TODO: We're repeating ourselves.
		tiles_arr.forEach((_item, _index) => {
			if(_item) {
				let pt=this.get_point(_index);
				this.tiles.push(new tile(pt.x, pt.y, _item));
			}
		});

//TODO: Fuck this too!. 1 solid, 2 bridge-left, 3 bridge-center, 4- bridge-right
		let background_arr=[
0,0,0,0,0,0,0,0,0,1,
0,0,0,0,0,0,0,0,0,1,
1,2,3,0,0,3,4,1,0,1,
1,0,0,0,0,0,0,1,0,1,
1,0,0,0,0,0,0,0,0,1,
1,0,0,0,0,4,1,1,1,1,
];
		this.background=[];
		background_arr.forEach((_item, _index) => {
			if(_item) {
				let pt=this.get_point(_index);
				this.background.push(new draw_tile(pt.x, pt.y, _item));
			}
		});
	}

	get_index(_x, _y) {
		//TODO: Check boundaries.
		return x + (_y * this.w);
	}

	get_point(_index) {
		return new point(_index % this.w, Math.floor(_index / this.w));
	}

	get_solid_tiles() {
		return this.tiles;
	}
}
