"use strict"

import {point_2d} from './point_2d.js';

const pos_top=0;
const pos_right=1;
const pos_bottom=2;
const pos_left=3;
const pos_inner_top=4;
const pos_inner_right=5;
const pos_inner_bottom=6;
const pos_inner_left=7;
export {pos_top, pos_right, pos_bottom, pos_left, pos_inner_bottom, pos_inner_left, pos_inner_right, pos_inner_top};

//!A rect in screen coordinates (h goes down).
export class rect {
	constructor(_pt, _w, _h) {
		if(!(_pt instanceof point_2d)) {
			throw new Error("rect must be built from point_2d");
		}
		this.origin=new point_2d(_pt.x, _pt.y);
		this.w=_w;
		this.h=_h;
	}

	collides_with(_other) {
		return rect.rects_collide(this, _other);
	}

	clone() {
		return new rect(this.origin, this.w, this.h);
	}

	//!Adjust this position so it lies on the _pos side of _other.
	adjust_to(_other, _pos) {
		switch(_pos) {
			case pos_top:		this.origin.y=_other.origin.y-this.h; break;
			case pos_bottom:	this.origin.y=_other.origin.y+_other.h; break;
			case pos_left:		this.origin.x=_other.origin.x+-this.w; break;
			case pos_right:		this.origin.x=_other.origin.x+_other.w; break;
			case pos_inner_top:	this.origin.y=_other.origin.y; break;
			case pos_inner_bottom:	this.origin.y=_other.origin.y+_other.h-this.h; break;
			case pos_inner_left:	this.origin.x=_other.origin.x; break;
			case pos_inner_right:	this.origin.x=_other.origin.x+_other.w-this.w; break;
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

		let fn_collision=function(_p1, _p2, _e1, _e2) {
			return !(_e2 <= _p1 || _p2 >= _e1);
		};

		if(!fn_collision(_a.origin.x, _b.origin.x, _a.origin.x+_a.w, _b.origin.x+_b.w)) {
			return false;
		}

		return fn_collision(_a.origin.y, _b.origin.y, _a.origin.y+_a.h, _b.origin.y+_b.h);
	}

	//!Returns true when _a is under _b, including directly under.
	static rect_is_under(_a, _b) {
		return _a.origin.y >= _b.origin.y+_b.h;
	}

	//!Returns true when _a is over _b, including directly over.
	static rect_is_over(_a, _b) {
		return _a.origin.y + _a.h <= _b.origin.y;
	}

	//!Returns true when a is to the left of b, including directly at its left.
	static rect_is_left_of(_a, _b) {
		return _a.origin.x+_a.w <= _b.origin.x;
	}

	//!Returns true when a is to the right of b,  including directly at its right.
	static rect_is_right_of(_a, _b) {
		return _a.origin.x >= _b.origin.x+_b.w;
	}
}
