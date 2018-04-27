"use strict"

import {rect, pos_left, pos_right, pos_top, pos_bottom} from '../core/rect.js';
import {vector_2d} from '../core/vector_2d.js';
import {point_2d} from '../core/point_2d.js';

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

		this.position=new rect(new point_2d(64, 0), 8, 16);
		this.last_position=this.position.copy();
		this.vector=new vector_2d();
		this.remaining_jumps=2;
	}

	get_input(_input) {
//document.getElementById('debug').innerHTML=_input.x+" "+_input.y;
		//Disable air control.
		if(!this.vector.y) {
			//JS will promote _input.x to float, it seems...
			this.vector.x=_input.x * player_walking_speed;
		}

		//Double jump... 
		//TODO: Can jump twice while falling. Don't like it.
		if(_input.y < 0 && /*this.vector.y==0.0* &&*/ this.remaining_jumps) {
			--this.remaining_jumps;
			this.vector.y=player_jump_factor;
			//Allow a change of direction.
			this.vector.x=_input.x * player_walking_speed;
		}
	}

	//TODO: We should actually use composition for this.
	loop_x(_delta) {
		if(this.vector.x) {
			this.position.origin.x+=this.vector.x*_delta;
		}
	}

	//TODO: We should actually use composition for this.
	loop_y(_delta) {

		this.do_gravity(_delta, 3.0, 80.0, 200.0);

		if(this.vector.y) {
			this.position.origin.y+=this.vector.y*_delta;
		}
	}

	do_gravity(_delta, _gravity_value, _weight, _max_fall_speed)
	{
		this.vector.integrate_y(_delta, _weight *_gravity_value);
		if(this.vector.y > _max_fall_speed) this.vector.y=_max_fall_speed;
	}

	//TODO: We should actually use composition for this... with callbacks.
	process_collision_x(_tile) {

		//We will stop if we are not in the air...
		if(!this.vector.y) {
			this.vector.x=0.0;
		}
		else {
			this.vector.x/=1.05;
		}
		

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
			//TODO. Reset function for the jumps. Or better, a callback.
			this.remaining_jumps=2;
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
