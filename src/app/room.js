"use strict"

import {rect} from '../core/rect.js';
import {point_2d} from '../core/point_2d.js';

const tile_w=32;
const tile_h=32;

//TODO: Do this right.
export class draw_tile {
	constructor(_x, _y, _t) {
		this.x=_x;
		this.y=_y;
		this.type=_t;
	}
};

//TODO: Perhaps 
export class tile {
	constructor(_x, _y, _t) {
		//TODO: Magic numbers??
		this.position=new rect(_x*tile_w, _y*tile_h, tile_w, tile_h);
		this.type=_t;
	}
};

export class room {

	//TODO: How should we do this?. Should we have a static function to
	//build it?
	
	constructor() {

		this.w=10;
		this.h=6;

		//Tiles is a hashed map, where the key is the index as returned
		//by get_index.
		this.tiles={};
		this.background=[];

//TODO: This is absolutely terrible. Really, it is... I think we should use
//an array with a list of coordinates. At least for the final thing.
		let tiles_arr=[
0,0,0,0,0,0,0,0,0,1,
0,0,0,0,0,0,0,0,0,1,
1,1,1,0,0,1,1,1,0,1,
1,0,0,0,0,0,0,1,0,1,
1,0,0,0,0,0,0,0,0,1,
1,0,0,0,0,1,1,1,1,1,
];

//TODO: Fuck this too!... 
// 1 solid, 2 bridge-left, 3 bridge-center, 4- bridge-right
		let background_arr=[
0,0,0,0,0,0,0,0,0,1,
0,0,0,0,0,0,0,0,0,1,
1,2,3,0,0,3,4,1,0,1,
1,0,0,0,0,0,0,1,0,1,
1,0,0,0,0,0,0,0,0,1,
1,0,0,0,0,4,1,1,1,1,
];


		let process=(_source, _fn) => {
			_source.forEach((_item, _index) => {
				if(_item) {
					_fn(this.get_point(_index), _item);
				}
			});
		};

		process(tiles_arr, (_pt, _item) => {
			this.tiles[this.get_index(_pt.x, _pt.y)]=new tile(_pt.x, _pt.y, _item);
		});
		
		process(background_arr, (_pt, _item) => {
			this.background.push(new draw_tile(_pt.x, _pt.y, _item));
		});
	}

	get_index(_x, _y) {
		//TODO: Check boundaries.
		return _x + (_y * this.w);
	}

	get_point(_index) {
		return new point_2d(_index % this.w, Math.floor(_index / this.w));
	}
	
	get_tiles_in_rect(_rect) {
		let result=[];
		//TODO:
/*
		calculate the range of x
		calculate the range of y
		for x
			for y
				it there exists the tile in x y
					add it to the result
*/
		return result;
	}
}
