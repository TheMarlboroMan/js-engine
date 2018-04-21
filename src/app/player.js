"use strict"

import {rect, pos_left, pos_right, pos_top, pos_bottom} from '../core/rect.js';
import {vector_2d} from '../core/vector_2d.js';

const player_walking_speed=80.0;
const player_jump_factor=-100.0;

export class player_input {
	constructor() {
		this.x=0;
		this.y=0;
	}
}

export class player {

	constructor() {

		this.position=new rect(0, 0, 8, 16);
		this.last_position=this.position.copy();
		this.vector=new vector_2d();
	}

	get_input(_input) {
//document.getElementById('debug').innerHTML=_input.x+" "+_input.y;
		//Disable air control.
		if(!this.vector.y) {
			if(_input.x < 0) {
				this.vector.x=-player_walking_speed;
			}
			else if(_input.x > 0) {
				this.vector.x=player_walking_speed;
			}
			else {
				this.vector.x=0.0;
			}
		}

		//TODO: Check that we are not on the air.
		//This could be done AT THE END of every step, calling a "get_status"
		//on the player. We should assume that the very first status
		//is air, just in case.

		//TODO: Won't jump... I am taking off but before I can move I guess
		//i am adjusted again...
//TODO... if you want to fix this, unit test the rect class. It might be detecting collisions where there are none.
		if(_input.y < 0 && this.vector.y==0.0) {
			this.vector.y=-player_jump_factor;
		}
	}

	//TODO: We should actually use composition for this.
	loop_x(_delta) {
		if(this.vector.x) {
			this.position.x+=this.vector.x*_delta;
		}
	}

	//TODO: We should actually use composition for this.
	loop_y(_delta) {
		this.vector.y+=128.0*_delta;
		//TODO: Not really integrated.
		if(this.vector.y) {
			this.position.y+=this.vector.y*_delta;
		}
	}

	//TODO: We should actually use composition for this... with callbacks.
	process_collision_x(_tile) {

		//We always stop...
		this.vector.x=0.0;

		//And adjust our position.
		if(this.last_position.is_left_of(_tile.position)) {
			this.position.adjust_to(_tile.position, pos_left);
		}
		else if(this.last_position.is_right_of(_tile.position)) {
			this.position.adjust_to(_tile.position, pos_right);
		}
		else {
			throw new Error("We got trapped on x...!");
		}
	}

	//TODO: We should actually use composition for this... with callbacks.
	process_collision_y(_tile) {

		this.vector.y=0.0;

		//Collision from below.
		if(this.last_position.is_under(_tile.position)) {
			this.position.adjust_to(_tile.position, pos_bottom);
		}
		//Touching the ground.
		else if(this.last_position.is_over(_tile.position)) {
			this.position.adjust_to(_tile.position, pos_top);
		}
		else {
			throw new Error("We got trapped on y...!");
		}
	}

	save_last_known() {
		this.last_position=this.position.copy();
	}
}
