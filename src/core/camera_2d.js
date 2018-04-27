"use strict"

//!The camera 2d has a position in space. It is used
//to modify the values called when using the display_2d_manipulator.

import {rect} from './rect.js'; 
import {point_2d} from './point_2d.js'; 

export class camera_2d {

	constructor(_rect) {

		if(!(_rect instanceof rect)) {
			throw new Error("camera_2d must be created from a rect");
		}
		this.position=_rect;
	}

	move_to(_pt) {

		if(!(_pt instanceof point_2d)) {
			throw new Error("move_to must be invoked with point_2d");
		}

		//TODO: Validate the possible limits!!!!.

		this.position.origin=_pt.copy();
	}

	move_by(_x, _y) {
		this.move_to(new point_2d(this.position.origin.x+_x, this.position.origin.y+_y));
	}

	center_on(_pt) {
		if(!(_pt instanceof point_2d)) {
			throw new Error("center_on must get a point_2d");
		}

		let center=new point_2d(_pt.x-(this.position.w/2), _pt.y-(this.position.h/2));
		this.move_to(center);
	}
}
