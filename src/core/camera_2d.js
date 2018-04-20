"use strict"

//!The camera 2d has a position in space. It is used
//to modify the values called when using the display_2d_manipulator.

export class camera_2d {

	constructor(_x, _y) {
		this.x=_x;
		this.y=_y;
	}

	move_to(_x, _y) {
		this.x=_x;
		this.y=_y;
	}

	move_by(_x, _y) {
		this.x+=_x;
		this.y+=_y;
	}
}
