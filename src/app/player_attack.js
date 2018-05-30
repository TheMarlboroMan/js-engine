"use strict"

import {rect, pos_right, pos_left} from '../core/rect.js';
import {point_2d} from '../core/point_2d.js';
import {player_attacks_collect, room_object} from './room_object.js'; 

const w=8;
const h=3;

export class player_attack extends room_object {

	constructor(_gc) {

		super(new rect(new point_2d(0,0), w, h), _gc);
		this.remaining_time=0.5;
	}

	get_damage() {
		return 10; //TODO: No magic.
	}

	get_collection_id() {
		return player_attacks_collect;
	}

	attach_to(_rect, _pos) {

		if(!(_rect instanceof rect)) {
			throw new Error("attach_to must be invoked with a rect");
		}

		switch(_pos) {
			case pos_right:
			case pos_left:
				this.adjust_to(_rect, _pos);
				this.get_position().origin.y=_rect.origin.y+(_rect.h/2)-(h/2);
			break;
			default:
				throw new Error("Invalid position for attach_to");
			break;
		}
	}

	loop(_delta) {

		this.remaining_time-=_delta;
		if(this.remaining_time <= 0.0) {
			this.mark_for_deletion();
		}
	}

}
