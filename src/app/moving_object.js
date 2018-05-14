"use strict"

import {rect, pos_left, pos_right, pos_top, pos_bottom} from '../core/rect.js';
import {vector_2d} from '../core/vector_2d.js';
import {room_object} from './room_object.js';

export class gravity_data {
	constructor(_gv, _w, _mfs) {
		this.gravity_value=_gv;
		this.weight=_w;
		this.max_fall_speed=_mfs;
	}
};

export class moving_object extends room_object {

	constructor(_rect) {
		super(_rect);
		this.vector=new vector_2d();
	}

	stop() {
		this.vector.x=0.0;
		this.vector.y=0.0;
	}

	get_vector_x() {
		return this.vector.x;
	}

	set_vector_x(_val) {
		this.vector.x=_val;
	}

	get_vector_y() {
		return this.vector.y;
	}

	set_vector_y(_val) {
		this.vector.y=_val;
	}

	process_collision_x(_rect) {

		if(this.last_position.is_left_of(_rect)) {
			this.callback_collision(_rect, pos_left);

		}
		else if(this.last_position.is_right_of(_rect)) {
			this.callback_collision(_rect, pos_right);
		}
		else {
			throw new Error("We got trapped on x...!");
		}
	}

	process_collision_y(_rect) {

		//Collision from below.
		if(this.last_position.is_under(_rect)) {
			this.callback_collision(_rect, pos_bottom);
		}
		//Touching the ground.
		else if(this.last_position.is_over(_rect)) {
			this.callback_collision(_rect, pos_top);
		}
		else {
			throw new Error("We got trapped on y...!");
		}
	}

	do_movement_x(_delta) {

		if(this.vector.x) {
			this.position.origin.x+=this.vector.x*_delta;
		}
	}

	do_movement_y(_delta, gd) {

		if(undefined!==gd) {
			this.do_gravity(_delta, this.gravity_data);
		}

		if(this.vector.y) {
			this.position.origin.y+=this.vector.y*_delta;
		}
	}

	callback_collision(_rect, _pos) {

		this.position.adjust_to(_rect, _pos);
	}

	do_gravity(_delta, _gd) {

		if(!(_gd instanceof gravity_data)) {
			throw new Error("do_gravity must be invoked with gravity data");
		}

		this.vector.integrate_y(_delta, _gd.weight * _gd.gravity_value);
		if(this.vector.y > _gd.max_fall_speed) this.vector.y=_gd.max_fall_speed;
	}
}
