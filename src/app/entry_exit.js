"use strict"

import {room_object} from './room_object.js';
import {rect} from '../core/rect.js';
import {point_2d} from '../core/point_2d.js';

export class room_entry extends room_object {

	constructor(_x, _y, _w, _h, _id, _f, _gc) {
		super(new rect(new point_2d(_x, _y), _w, _h), _gc);

		this.id=_id;
		this.facing=_f;
	}
}

export class room_exit extends room_object {

	constructor(_x, _y, _w, _h, _dest, _id, _gc) {
		super(new rect(new point_2d(_x, _y), _w, _h), _gc);
		this.destination=_dest;
		this.entry_id=_id;
	}

	//TODO: Bah... Use a proper object for this.
	get_type() {
		return "exit";
	}
}
