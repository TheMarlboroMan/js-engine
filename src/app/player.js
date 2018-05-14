"use strict"

import {rect, pos_top} from '../core/rect.js';
import {point_2d} from '../core/point_2d.js';
import {moving_object, gravity_data} from './moving_object.js';

const player_walking_speed=80.0;
const player_jump_factor=-100.0;
const facing_right=1;
const facing_left=0;

export class player_input {
	constructor() {
		this.x=0;
		this.y=0;
	}
}

export class player extends moving_object {

	constructor() {
		super(new rect(new point_2d(0, 0), 8, 16));

		this.last_position=this.position.clone();
		this.remaining_jumps=2;
		this.jumping=true;
		this.facing=facing_right;
		this.gravity_data=new gravity_data(3.0, 80.0, 200.0);
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

	loop_x(_delta) {

		//Decrease speed while falling.
		if(this.get_vector_x() && !this.jumping && this.get_vector_y() > 0.0) {
			this.set_vector_x(this.get_vector_x()*0.9);
		}

		this.do_movement_x(_delta);
	}

	loop_y(_delta) {
		this.do_movement_y(_delta, this.gravity_data);
	}

	process_collision_x(_rect) {

		//And adjust our position.
		super.process_collision_x(_rect);

		//We will stop if we are not in the air...
		if(!this.get_vector_y()) {
			this.set_vector_x(0.0);
		}
		else {
			this.set_vector_x(this.get_vector_x()*1.05);
		}
	}

	process_collision_y(_rect) {

		super.process_collision_y(_rect);
	}

	callback_collision(_rect, _pos) {

		super.callback_collision(_rect, _pos);
		this.set_vector_y(0.0);
		if(_pos==pos_top) {
			this.touch_ground();
		}
	}

	save_last_known() {
		this.last_position=this.position.clone();
	}

	touch_ground() {
		//TODO: Perhaps... on_ground=true?.
		this.jumping=false;
		this.remaining_jumps=2;
	}
}
