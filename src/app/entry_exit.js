"use strict"

import {room_object} from './room_object.js';
import {rect} from '../core/rect.js';
import {point_2d} from '../core/point_2d.js';
import {tile_w, tile_h} from './tile.js';

export class room_entry extends room_object {

	constructor(_x, _y, _id, _f) {
		//TODO: This sucks. I don't really need this dependency.
		//TODO: Remove dependency, ask the factory to do this.
		super(new rect(new point_2d(_x*tile_w, _y*tile_h), tile_w, tile_h));

		this.id=_id;
		this.facing=_f;
	}
}

export class room_exit extends room_object {

	constructor(_x, _y, _dest, _id) {
		//TODO: This sucks. I don't really need this dependency.
		//TODO: Remove dependency, ask the factory to do this.
		super(new rect(new point_2d(_x*tile_w, _y*tile_h), tile_w, tile_h));

		this.destination=_dest;
		this.entry_id=_id;
	}

	//TODO: Bah... Use a proper object for this.
	get_type() {
		return "exit";
	}
}
