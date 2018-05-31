"use strict"

import {rect, pos_right, pos_left} from '../core/rect.js';
import {point_2d} from '../core/point_2d.js';
import {player_attacks_collect, room_object} from './room_object.js'; 
import {countdown_to_zero_delta} from './tools.js';

const w=8;
const h=3;

const default_damage=10;
const attack_time=0.5;

export class player_attack extends room_object {

	//!Side indicate pos_left or pos_right, depending on which side of the player it appears on.
	constructor(_gc, _side) {

		super(new rect(new point_2d(0,0), w, h), _gc);
		this.remaining_time=attack_time;
		this.side=_side; 
	}

	get_damage() {
		return default_damage;
	}

	get_collection_id() {
		return player_attacks_collect;
	}

	attach_to(_rect) {

		if(!(_rect instanceof rect)) {
			throw new Error("attach_to must be invoked with a rect");
		}

		switch(this.side) {
			case pos_right:
			case pos_left:
				this.adjust_to(_rect, this.side);
				this.get_position().origin.y=_rect.origin.y+(_rect.h/2)-(h/2);
			break;
			default:
				throw new Error("Invalid position for attach_to");
			break;
		}
	}

	loop(_delta, _rect) {

		this.attach_to(_rect);

		this.remaining_time=countdown_to_zero_delta(this.remaining_time, _delta);
		if(!this.remaining_time) {
			this.mark_for_deletion();
		}
	}

}
