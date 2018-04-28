"use strict"

import {rect} from '../core/rect.js';
import {point_2d} from '../core/point_2d.js';
import {map} from './map_loader.js';

const tile_w=16;
const tile_h=16;

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
		let pt=new point_2d(_x*tile_w, _y*tile_h);
		this.position=new rect(pt, tile_w, tile_h);
		this.type=_t;
	}
};

export class room {

	//TODO: How should we do this?. Should we have a static function to
	//build it?
	
	constructor() {

		this.w=0;
		this.h=0;

		//Tiles is a hashed map, where the key is the index as returned
		//by get_index.
		this.tiles={};
		this.background=[];
	}

	from_map(_map) {

		if(!(_map instanceof map)) {
			throw new Error("from_map must be called with a valid map");
		}

		this.w=_map.w;
		this.h=_map.h;

		let process=(_source, _fn) => {
			_source.forEach((_item) => {
				if(_item) {
					_fn(_item.x, _item.y, parseInt(_item.t, 10));
				}
			});
		};

		let fn_tiles=(_x, _y, _t) => {
			this.tiles[this.get_index(_x, _y)]=new tile(_x, _y, _t);
		};

		let fn_back=(_x, _y, _t) => {
			this.background.push(new draw_tile(_x, _y, _t));
		};

		process(_map.logic, fn_tiles);
		process(_map.background, fn_back);
	}

	get_index(_x, _y) {
		//TODO: Check boundaries.
		return _x + (_y * this.w);
	}

/*
	get_point(_index) {
		return new point_2d(_index % this.w, Math.floor(_index / this.w));
	}
*/
	
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

	get_world_size_rect() {
		return new rect(new point_2d(0,0), this.w*tile_w, this.h*tile_h);
	}
}
