"use strict"

import {rect} from '../core/rect.js';
import {room_data_container} from './room_data_container.js';
import {collision_checker_type_enemy} from './collision_checker_types.js';
import {tile_w, tile_h} from './tile.js';

export class collision_checker {

	constructor(_rdc, _w) {
		//TODO: Check types!.

		this.rdc=_rdc;
		this.w=_w;
	}

	get_collisions_for(_item) {

		//TODO: Check types.
		switch(_item.get_collision_checker_type()) {
			case collision_checker_type_enemy: 
				return this.get_collisions_for_enemy(_item.get_position());
			break;
			default:
				throw new Error("get_collisions_for cannot be resolved");
			break;
		}
	}

	//!Returns all tiles bounded to the rectangle.
	get_tiles_in_rect(_rect) {

		//TODO: Check types.

		let result=[];

		let begin_x=Math.floor(_rect.origin.x / tile_w);
		let begin_y=Math.floor(_rect.origin.y / tile_h);
		let end_x=Math.floor((_rect.origin.x+_rect.w) / tile_w);
		let end_y=Math.floor((_rect.origin.y+_rect.h) / tile_h);

		for(let x=begin_x; x <= end_x; x++) {
			for(let y=begin_y; y <= end_y; y++) {
				if(undefined!==this.rdc.tiles[this.get_index(x, y)]) {
					result.push(this.rdc.tiles[this.get_index(x, y)]);
				}
			}
		}

		return result;
	}

	//TODO: This might end up repeated... unless we make it static.
	get_index(_x, _y) {
		//TODO: Check boundaries.
		return _x + (_y * this.w);
	}

	get_collisions_for_enemy(_rect) {

		return this.get_tiles_in_rect(_rect)
			.filter((_tile) => {
				return (_tile.is_solid() || _tile.blocks_enemies())
				&& _rect.collides_with(_tile.position);
		});
	}
}
