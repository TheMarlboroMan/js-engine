"use strict"

import {rect} from '../core/rect.js';

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
};

