"use strict"

import {rect, pos_right, pos_left} from '../core/rect.js';
import {room_object} from './room_object.js'; 
import {deleter} from './deleter.js'; //TODO: Should be in room 



//TODO: This should be attached to the room as some sort of 
//player_attack array. 

export class player_attack extends room_object {

	constructor(_rect, _gc) {

		if(!(_gc instanceof deleter)) {
			throw new Error("player_attack must be constructed with a deleter");
		}

		super(_rect);
		this.deleter=_gc;
		this.remaining_time=0.5;
	}

	attach_to(_rect, _pos) {

		if(!(_rect instanceof rect)) {
			throw new Error("attach_to must be invoked with a rect");
		}

		//TODO: What about the height???
		switch(_pos) {
			case pos_right:
			case pos_left:
				this.adjust_to(_rect, _pos);
			break;
			default:
				throw new Error("Invalid position for attach_to");
			break;
		}
	}

	loop(_delta) {

		this.remaning_time-=_delta;

		if(this.remaining_time <= 0.0) {

console.log("player attack expired");

			this.deleter.collect(this);
		}
	}

}
