"use strict"

export class point_2d {
	constructor(_x, _y) {
		this.x=_x;
		this.y=_y;
	}

	copy() {
		return new point_2d(this.x, this.y);
	}
};
