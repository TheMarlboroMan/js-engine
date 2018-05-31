"use strict"

import {rect, pos_left, pos_right} from '../core/rect.js';
import {point_2d} from '../core/point_2d.js';
import {moving_object, axis_x, axis_y} from './moving_object.js';
import {enemies_collect} from './room_object.js';
import {countdown_to_zero_delta} from './tools.js';

//!All enemies are considered moving... Even if they behave like stationary things.
export class enemy extends moving_object {

	constructor(_pt, _gc) {

		if(!(_pt instanceof point_2d)) {
			throw new Error("enemy must be built from point_2d");
		}

		super(new rect(_pt.clone(), 8, 16), _gc);

		this.health=0;
		this.remaining_invulnerability=0.0;
	}

	get_collection_id() {
		return enemies_collect;
	}

	get_health() {
		return health;
	}

	set_health(_v) {
		this.health=_v;
	}

	suffer_damage(_v) {

		if(this.can_take_damage()) {
			this.health-=_v;
			if(this.health <= 0) {
				this.mark_for_deletion();
			}
			else {
				//TODO: No magic.
				this.remaining_invulnerability=0.5;
			}
		}
	}

	can_take_damage() {
		return 0.0==this.remaining_invulnerability;
	}

	loop(_delta, _rect) {

		if(this.remaining_invulnerability) {
			this.remaining_invulnerability=countdown_to_zero_delta(this.remaining_invulnerability, _delta);
		}
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

	//TODO: To this properly: return some collision data object.
	get_type() {
		return "enemy";
	}
}

//!An enemy that patrols left and right, until it finds some obstacle and turns
//!back.
//TODO: The logic for this patrolling is not in this class, which is actually
//off-putting. One would have to go into the room.loop method to see what
//makes these things turn... I must fix that.

const patrolling_enemy_health=20;
const patrolling_enemy_speed=30.0;

export class patrolling_enemy extends enemy {

	constructor(_x, _y, _gc) {
		super(new point_2d(_x, _y), _gc);
		this.set_vector_x(patrolling_enemy_speed);
		this.set_health(patrolling_enemy_health);
	}

	loop(_delta, _rect) {

		super.loop(_delta);

		if(this.can_take_damage()) {
			super.move(_delta);
		}

		//TODO: The real logic should go here.
	}

	callback_collision(_rect, _pos) {

		super.callback_collision(_rect, _pos);
		switch(_pos) {
			case pos_left:
			case pos_right: //Invert movement vector.
				this.set_vector_x(this.get_vector_x()*-1);
			break;
		}
	}
}
