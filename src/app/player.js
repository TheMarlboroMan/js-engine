"use strict"

import {rect, pos_top, pos_bottom, pos_left, pos_right} from '../core/rect.js';
import {point_2d} from '../core/point_2d.js';
import {moving_object, gravity_data, axis_x, axis_y} from './moving_object.js';
import {facing_left, facing_right} from './room_object.js';

const player_walking_speed=80.0;
const player_jump_factor=-100.0;

export class player_input {
	constructor() {
		this.x=0;
		this.y=0;
	}
}

//TODO: Not liking this Movement and combat states should be separate.
const player_state_regular=0;
const player_state_attack=1;

export class player extends moving_object {

	constructor(_gc) {
		super(new rect(new point_2d(0, 0), 8, 16), _gc);

		this.state=player_state_regular;
		//TODO: No magic...
		this.remaining_jumps=2;
		this.jumping=true;
		this.facing=facing_right;
		//TODO: No magic.
		this.gravity_data=new gravity_data(3.0, 80.0, 200.0);
		this.attack_cooloff=0.0;
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

	//TODO: What a lie... loop should be called only once!.
	loop(_delta) {
		if(this.attack_cooloff) {
			this.attack_cooloff-=_delta;
			if(this.attack_cooloff<=0.0) {
				this.attack_cooloff=0.0;
				//TODO: Not so sure about that... perhaps attacking=false?
				this.state=player_state_regular;
			}
		}
	}

	do_movement(_axis, _delta) {

		if(axis_x===_axis) {
			//Decrease speed while falling.
			if(this.get_vector_x() && !this.jumping && this.get_vector_y() > 0.0) {
				this.set_vector_x(this.get_vector_x()*0.9);
			}
			//TODO: I don't like the state thing.
			else if(this.state==player_state_attack && 0.0==this.get_vector_y()) {
				return; //No movement on the X axis when attacking on the floor.
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
		//TODO: Perhaps... on_ground=true?.
		this.jumping=false;
		this.remaining_jumps=2;
	}

	can_attack() {
		return player_state_regular===this.state;
	}

	set_attacking(_cooloff) {
		this.state=player_state_attack;
		this.attack_cooloff=_cooloff;
		if(!this.jumping) {
			this.set_vector_x(0.0);
		}
	}
}
