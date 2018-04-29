"use strict"

import {rect} from '../core/rect.js';
import {point_2d} from '../core/point_2d.js';
import {map} from './map_loader.js';

const tile_w=16;
const tile_h=16;

//TODO: This should be a bit more complex.
export class draw_tile {
	constructor(_x, _y, _t) {
		this.x=_x;
		this.y=_y;
		this.type=_t;
	}
};

//TODO: Perhaps in another file???
export class tile {
	constructor(_x, _y, _t) {
		let pt=new point_2d(_x*tile_w, _y*tile_h);
		this.position=new rect(pt, tile_w, tile_h);
		this.type=_t;
	}
};

export class room {

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
					_fn(_item.x, _item.y, _item.t);
				}
			});
		};

		let fn_tiles=(_x, _y, _t) => {
			this.tiles[""+this.get_index(_x, _y)]=new tile(_x, _y, _t);
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

		let begin_x=Math.floor(_rect.origin.x / tile_w);
		let begin_y=Math.floor(_rect.origin.y / tile_h);
		let end_x=Math.floor((_rect.origin.x+_rect.w) / tile_w);
		let end_y=Math.floor((_rect.origin.y+_rect.h) / tile_h);

		for(let x=begin_x; x <= end_x; x++) {
			for(let y=begin_y; y <= end_y; y++) {
				if(undefined!==this.tiles[this.get_index(x, y)]) {
					result.push(this.tiles[this.get_index(x, y)]);
				}
			}
		}
//document.getElementById('debug').innerHTML=_rect.origin.x+' / '+tile_w+' = '+(_rect.origin.x / tile_w)+'<br/>'+begin_x+' -> '+end_x+' '+begin_y+' -> '+end_y;

		return result;
	}

	get_world_size_rect() {
		return new rect(new point_2d(0,0), this.w*tile_w, this.h*tile_h);
	}
}
