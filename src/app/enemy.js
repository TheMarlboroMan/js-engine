"use strict"

import {rect} from '../core/rect.js';
import {point_2d} from '../core/point_2d.js';
import {moving_object, axis_x, axis_y} from './moving_object.js';

//!All enemies are considered moving... Even if they behave like stationary things.
export class enemy extends moving_object {

	constructor(_pt) {

		if(!(_pt instanceof point_2d)) {
			throw new Error("enemy must be built from point_2d");
		}

		super(new rect(_pt.clone(), 8, 16));
	}

	loop(_delta, _rect) {
		throw new Error("Called loop on base enemy class");
	}

	move(_delta) {

		super.save_last_known_position();

		if(this.get_vector_x()) {
			this.do_movement(axis_x, _delta, null);
		}

		//TODO: Add get_gravity???
		if(this.get_vector_y()) {
			this.do_movement(axis_y, _delta, null);
		}
	}


	callback_collision(_rect, _pos) {

		super.callback_collision(_rect, _pos);
	}

	//TODO: bah.
	get_type() {
		return "enemy";
	}
}

export class patrolling_enemy extends enemy {

	constructor(_x, _y) {
		super(new point_2d(_x, _y));
		//TODO: No magic numbers.
		this.set_vector_x(80.0);
	}

	loop(_delta, _rect) {

		super.move(_delta);
	}

	callback_collision(_rect, _pos) {

		super.callback_collision(_rect, _pos);
		switch(_pos) {
			case pos_left:
			case pos_right:
				this.set_vector_x(this.get_vector_x()*-1);
			break;
		}
	}
}
