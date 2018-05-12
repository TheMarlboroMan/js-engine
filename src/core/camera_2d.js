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
		this.limits=null;
	}

	

	//!This is the one and only point that controls camera movement....
	move_to(_pt) {

		if(!(_pt instanceof point_2d)) {
			throw new Error("move_to must be invoked with point_2d");
		}

		if(null!==this.limits) {

			let fn=(_lim_pos, _lim_dim, _dim, _ptn) => {
				if(_lim_dim >= _dim) {
					if(_ptn < _lim_pos) { //Left/topmost side.
						return _lim_pos
					}
					else if(_ptn+_dim > _lim_pos+_lim_dim) {
						return _lim_dim+_lim_pos-_dim;
					}
					else {
						return _ptn;
					}
				}
				else {
					return _lim_pos+(_lim_dim / 2) - (_dim / 2);
				}
			};

			let point=_pt.clone();
			point.x=fn(this.limits.origin.x, this.limits.w, this.position.w, point.x);
			point.y=fn(this.limits.origin.y, this.limits.h, this.position.h, point.y);
			this.position.origin=point.clone();
		}
		else {
			this.position.origin=_pt.clone();
		}
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

	set_limits(_rect) {
		if(!(_rect instanceof rect)) {
			throw new Error("set_limits must get a rect");
		}

		this.limits=_rect;
	}

	clear_limits() {
		this.limits=null;
	}
}
