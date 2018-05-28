"use strict"

import {rect, pos_right, pos_left} from '../core/rect.js';
import {room_object} from './room_object.js';

export class deleter {

	constructor() {
		//TODO.
	}

	collect(_deletable) {
		//TODO: Must differentiate different objects,
		//to delete from different reference containers.
	}
}

//TODO: This should be attached to the room as some sort of 
//player_attack array. 

export class player_attack extends room_object {

	//TODO: Should be constructed with a garbage collector.
	constructor(_rect, _gc) {

		if(!(_gc instanceof deleter)) {
			throw new Error("player_attack must be constructed with a deleter");
		}

		super(_rect);
		this.deleter=_gc;

		this.remaining_time=0.5;
	}

	attach_to(_rect, _pos) {
		if(!(_rect instanceof rect) {
			throw new Error("attach_to must be invoked with a rect");
		}

		//TODO: What about the height???
		switch(_pos) {
			case pos_right:

			break;
			case pos_left:

			break;
			default:
				throw new Error("Invalid position for attach_to");
			break;
		}
	}

	loop(_delta) {

		this.remaning_time-=_delta;

		if(this.remaining_time <= 0.0) {
			this.deleter.collect(this);
		}
	}

}
