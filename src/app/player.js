"use strict"

import {rect} from '../core/rect.js';
import {vector_2d} from '../core/vector_2d.js';

const player_walking_speed=80.0;

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
		if(_input.y < 0 && this.vector.y==0.0) {
			this.vector.y=-100.0;
		}
	}



	loop_x(_delta) {
		if(this.vector.x) {
			this.position.x+=this.vector.x*_delta;
		}
	}

	loop_y(_delta) {

		this.vector.y+=128.0*_delta;
		//TODO: Not really integrated.
		if(this.vector.y) {
			this.position.y+=this.vector.y*_delta;
		}
	}

	process_collision_x(_tile) {

		this.position.x=this.last_position.x;
		this.vector.x=0.0;
	}

	process_collision_y(_tile) {

		this.position.y=this.last_position.y;
		this.vector.y=0.0;
	}

	save_last_known() {
		this.last_position=this.position.copy();
	}

//	reset_last_known() {

//		this.position=this.last_position.copy();
//		this.vector.reset();
//	}
}
