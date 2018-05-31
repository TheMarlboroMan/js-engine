"use strict"

import {rect, pos_top, pos_bottom, pos_left, pos_right} from '../core/rect.js';
import {point_2d} from '../core/point_2d.js';
import {moving_object, gravity_data, axis_x, axis_y} from './moving_object.js';
import {facing_left, facing_right} from './room_object.js';
import {countdown_to_zero_delta} from './tools.js';

class attack_melee_data {

	constructor(_co) {
		//TODO: Is this magic???
		this.pre_attack_count=0.1;
		this.max_cooloff=_co;
		this.cooloff_count=this.max_cooloff;
	}

	loop(_delta) {
		if(this.pre_attack_count) {
			this.pre_attack_count=countdown_to_zero_delta(this.pre_attack_count, _delta);
		}
		else if(this.cooloff_count) {
			this.cooloff_count=countdown_to_zero_delta(this.cooloff_count, _delta);
		}
	}

	is_precounting() {
		return this.pre_attack_count;
	}

	has_started_cooloff() {
		return this.cooloff_count!=this.max_cooloff;
	}

	is_done() {
		return 0.0==this.pre_attack_count && 0.0==this.cooloff_count;
	}
};

export class player_input {
	constructor() {
		this.x=0;
		this.y=0;
	}
}

const player_walking_speed=80.0;
const player_jump_factor=-100.0;

const gravity_const=3.0;
const weight=80.0;
const max_fall_speed=200.0;

const jump_count=2;
const w=8;
const h=16;

export class player extends moving_object {

	constructor(_gc) {
		super(new rect(new point_2d(0, 0), w, h), _gc);

		this.remaining_jumps=jump_count;
		this.jumping=true;
		this.facing=facing_right;
		this.gravity_data=new gravity_data(gravity_const, weight, max_fall_speed);

		this.attack_data=null;
	}

	is_facing_right() {
		return facing_right===this.facing;
	}

	get_input(_input, _audio) {

		//Horizontal movement, disabling air control...
		if(!this.get_vector_y()) {

			if(_input.x) {
				this.set_vector_x(_input.x * player_walking_speed);
			}
			else {
				this.set_vector_x(0.0);
			}
		}

		//Double jump... 
		//TODO: Can jump twice while falling. Don't like it.
		if(_input.y && this.remaining_jumps) {

			--this.remaining_jumps;

			//Jump and allow a change of direction.
			this.set_vector_y(player_jump_factor);
			this.set_vector_x(_input.x * player_walking_speed);
			this.jumping=true;
	
			//TODO: Shit. This is shit.
			//TODO: Audio makes everything go slow... I guess it is this computer.
			_audio.play("assets/audio/3.wav");
		}
	}

	set_vector_x(_val) {

		super.set_vector_x(_val);

		if(_val) {
			this.facing = this.get_vector_x() > 0 ? facing_right : facing_left;
		}
	}

	loop(_delta) {

		if(this.attack_data) {

			this.attack_data.loop(_delta);
			if(this.attack_data.is_done()) {
				delete this.attack_data;
				this.attack_data=null;
			}
		}
	}

	do_movement(_axis, _delta) {

		if(axis_x===_axis) {
			//Decrease speed while falling.
			if(this.get_vector_x() && !this.jumping && this.get_vector_y() > 0.0) {
				this.set_vector_x(this.get_vector_x()*0.9);
			}
			//TODO: Can be better... Ask the attack data if the player can move??
			//No movement on the X axis when attacking on the floor.
			else if(null!==this.attack_data && 0.0==this.get_vector_y()) {
				return; 
			}
		}
		else if(axis_y===_axis) {
			//Noop.
		}
		else throw new Error("Unknown player axis");

		super.do_movement(_axis, _delta, this.gravity_data);
	}

	callback_collision(_rect, _pos) {

		super.callback_collision(_rect, _pos);

		switch(_pos) {
			case pos_left:
			case pos_right:
				//We will stop if we are not in the air...
				if(!this.get_vector_y()) {
					this.set_vector_x(0.0);
				}
				else {
					this.set_vector_x(this.get_vector_x()/1.05);
				}
			break;
			case pos_top: 
				this.set_vector_y(0.0);
				this.touch_ground();
			break;
			case pos_bottom:
				this.set_vector_y(0.0);
			break;
		}
	}

	touch_ground() {
		//TODO: Perhaps... on_ground=true?...
		this.jumping=false;
		this.remaining_jumps=jump_count;
	}

	can_attack() {
		return null===this.attack_data;
	}

	must_create_attack() {
		return	null!==this.attack_data 
			&& !this.attack_data.is_precounting()
			&& !this.attack_data.has_started_cooloff();
	}

	start_attacking(_cooloff) {

		this.attack_data=new attack_melee_data(_cooloff);

		//TODO: Maybe ask the attack itself...
		if(!this.jumping) {
			this.set_vector_x(0.0);
		}
	}
}
