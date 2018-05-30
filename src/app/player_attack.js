"use strict"

import {rect, pos_right, pos_left} from '../core/rect.js';
import {point_2d} from '../core/point_2d.js';
import {room_object} from './room_object.js'; 

const w=8;
const h=3;

//TODO: This should be attached to the room as some sort of 
//player_attack array. 

export class player_attack extends room_object {

	//TODO: The _gc thing should go deeper, to the very depths of the room_obkect.
	constructor(_gc) {

		super(new rect(new point_2d(0,0), w, h), _gc);
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
				this.get_position().origin.y=_rect.origin.y+(_rect.h/2);
			break;
			default:
				throw new Error("Invalid position for attach_to");
			break;
		}
	}

	loop(_delta) {

		this.remaining_time-=_delta;
		if(this.remaining_time <= 0.0) {
			this.deleter.collect(this);
		}
	}

}
