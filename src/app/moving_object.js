"use strict"

import {rect, pos_left, pos_right, pos_top, pos_bottom} from '../core/rect.js';
import {vector_2d} from '../core/vector_2d.js';
import {room_object} from './room_object.js';

export const axis_x=0;
export const axis_y=1;

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
		this.last_position=this.position.clone();
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

	process_collision(_axis, _rect) {

		if(!(_rect instanceof rect)) {
			throw new Error("process_collision must be called with an instance of rect");
		}

		if(axis_x===_axis) {
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
		else if(axis_y===_axis) {
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
		else {
			throw new Error("Unknown axis");
		}
	}

	do_movement(_axis, _delta, _gd) {
		if(axis_x===_axis) {
			if(this.vector.x) {
				this.position.origin.x+=this.vector.x*_delta;
			}
		}
		else if(axis_y===_axis) {
			if(undefined!==_gd) {
				this.do_gravity(_delta, _gd);
			}

			if(this.vector.y) {
				this.position.origin.y+=this.vector.y*_delta;
			}
		}
		else throw new Error("Unknown axis for do_movement");
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

	save_last_known_position() {
		this.last_position=this.position.clone();
	}
}
