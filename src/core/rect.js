"use strict"

//TODO: This is useless as it is. I think we'd need to export some constants.
const pos_top=0;
const pos_right=1;
const pos_bottom=2;
const pos_left=3;
export {pos_top, pos_right, pos_bottom, pos_left};

//!A rect in screen coordinates (h goes down).
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

	copy() {
		return new rect(this.x, this.y, this.w, this.h);
	}

	//!Adjust this position so it lies on the _pos side of _other.
	adjust_to(_other, _pos) {
		switch(_pos) {
			case pos_top:	this.y=_other.y-this.h; break;
			case pos_bottom:this.y=_other.y+_other.h; break;
			case pos_left:	this.x=_other.x+-this.w; break;
			case pos_right:	this.x=_other.x+_other.w; break;
			default: throw new Error('Unknown position '+_pos+' when calling adjust_to'); break;
		}
	}

	is_under(_other) {
		return rect.rect_is_under(this, _other);
	}

	is_over(_other) {
		return rect.rect_is_over(this, _other);
	}

	is_left_of(_other) {
		return rect.rect_is_left_of(this, _other);
	}
	
	is_right_of(_other) {
		return rect.rect_is_right_of(this, _other);
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

	//!Returns true when _a is under _b, including directly under.
	static rect_is_under(_a, _b) {
		return _a.y >= _b.y+_b.h;
	}

	//!Returns true when _a is over _b, including directly over.
	static rect_is_over(_a, _b) {
		return _a.y + _a.h <= _b.y;
	}

	//!Returns true when a is to the left of b, including directly at its left.
	static rect_is_left_of(_a, _b) {
		return _a.x+_a.w <= _b.x;
	}

	//!Returns true when a is to the right of b,  including directly at its right.
	static rect_is_right_of(_a, _b) {
		return _a.x >= _b.x+_b.w;
	}
}
