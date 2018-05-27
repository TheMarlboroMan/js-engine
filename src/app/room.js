"use strict"

import {rect} from '../core/rect.js';
import {point_2d} from '../core/point_2d.js';
import {map} from './map_loader.js';
import {room_object} from './room_object.js';

const tile_w=16;
const tile_h=16;

const obj_type_entry=1;
const obj_type_exit=2;

//TODO: This should be a bit more complex.
export class draw_tile {
	constructor(_x, _y, _t) {
		this.x=_x;
		this.y=_y;
		this.type=_t;
	}
};

export class tile extends room_object {
	constructor(_x, _y, _t) {
		super(new rect(new point_2d(_x*tile_w, _y*tile_h), tile_w, tile_h));
		this.type=_t;
	}

	//TODO: Why not is_solid?. This needs more work.

	is_deadly() {
		//TODO: No fucking magic.
		return 5==this.type;
	}

	//!Platform means "can be jumped on from below".
	is_platform() {
		//TODO: No magic please.
		return 2==this.type;
	}
};


export class room_entry extends room_object {

	constructor(_x, _y, _id, _f) {
		super(new rect(new point_2d(_x*tile_w, _y*tile_h), tile_w, tile_h));

		this.id=_id;
		this.facing=_f;
	}
}

export class room_exit extends room_object {

	constructor(_x, _y, _dest, _id) {
		super(new rect(new point_2d(_x*tile_w, _y*tile_h), tile_w, tile_h));

		this.destination=_dest;
		this.entry_id=_id;
	}
}

export class room {

	constructor() {

		this.w=0;
		this.h=0;

		//Tiles is a hashed map, where the key is the index as returned
		//by get_index.
		this.tiles={};
		this.background=[];

		this.entries=[];
		this.exits=[];
	}

	from_map(_map) {

		this.tiles={};
		this.background.length=0;
		this.entries.length=0;
		this.exits.length=0;

		if(!(_map instanceof map)) {
			throw new Error("from_map must be called with a valid map");
		}

		this.w=_map.w;
		this.h=_map.h;

		let process=(_source, _fn) => {
			_source.forEach((_item) => {
				if(_item.t) {
					_fn(_item);
				}
			});
		};

		let fn_tiles=(_item) => {
			this.tiles[""+this.get_index(_item.x, _item.y)]=new tile(_item.x, _item.y, _item.t);
		};

		let fn_back=(_item) => {
			this.background.push(new draw_tile(_item.x, _item.y, _item.t));
		};

		let fn_obj=(_item) => {

			//TODO: Create a factory.
			switch(_item.t) {
				case obj_type_entry:
					this.entries.push(new room_entry(_item.x, _item.y, parseInt(_item.a.id, 10), parseInt(_item.a.facing, 10)));
				break;
				case obj_type_exit: 
					this.exits.push(new room_exit(_item.x, _item.y, _item.a.dest, parseInt(_item.a.entry_id, 10)));
				break;
			}
		};

		process(_map.logic, fn_tiles);
		process(_map.objects, fn_obj);
		process(_map.background, fn_back);
	}

	get_index(_x, _y) {
		//TODO: Check boundaries.
		return _x + (_y * this.w);
	}

	get_entry_by_id(_id) {
		let res=this.entries.find((_item) => {return _item.id===_id;});
		if(undefined===res) {
			throw new Error("Cannot find entry with id "+_id);
		}
		return res;
	}

	get_map_objects_in_rect(_rect) {

		let result=[];
		this.exits.forEach((_item) => {
			if(_item.get_position().collides_with(_rect)) {
				result.push(_item);
			}
		});
		return result;
	}

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
		return new rect(new point_2d(tile_w,tile_h), (this.w-2)*tile_w, (this.h-2)*tile_h);
	}
}
