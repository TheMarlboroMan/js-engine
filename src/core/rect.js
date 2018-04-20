"use strict"

export class rect {
	constructor(_x, _y, _w, _h) {
		this.x=_x;
		this.y=_y;
		this.w=_w;
		this.h=_h;
	}

	collides_with(_other) {
		return rect.rects_collide(this, _other);
	}

	static rects_collide(_a, _b) {

		let no_unit_collision=function(_p1, _p2, _e1, _e2) {
			return !(_e2 <= _p1 || _p2 >= _e1);
		};

		let 	in_x=no_unit_collision(_a.x, _b.x, _a.x+_a.w, _b.x+_b.w);
		if(!in_x) return false;

		let in_y=no_unit_collision(_a.y, _b.y, _a.y+_a.h, _b.y+_b.h);
		return in_y;
//		return in_x && in_y;
	}

	copy() {
		return new rect(this.x, this.y, this.w, this.h);
	}
}
