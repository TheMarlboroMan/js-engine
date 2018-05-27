"use strict"

import {rect} from '../core/rect.js';

export const facing_right=1;
export const facing_left=0;

export class room_object {

	constructor(_rect) {

		if(!(_rect instanceof rect)) {
			throw new Error("room_object must be built from a rect");
		}
		this.position=_rect.clone();
	}

	get_position() {
		return this.position;
	}

	move_to(_pt) {
		if(!(_pt instanceof point_2d)) {
			throw new Error("move_to must get a point_2d");
		}

		this.position.origin=_pt.clone();
	}

	adjust_to(_rect, _type) {
		this.position.adjust_to(_rect, _type);
	}

	//TODO: Fuck this... 
	//I'd rather request some "collision_response" object to implement
	//some sort of double dispatching.
	get_type() {
		throw new Error("Called get_type on room_object base");
	}
};

