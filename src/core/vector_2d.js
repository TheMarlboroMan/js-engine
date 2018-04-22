"use strict"

//!The vector is passed through reference.
//!_factor is the factor/speed of movement.

//TODO: Missing LOTS of methods.
export class vector_2d {
	constructor() {
		this.x=0.0;
		this.y=0.0;
	}

	reset() {
		this.x=0.0;
		this.y=0.0;
	}

	add_value(_val) {
		this.x+=_val;
		this.y+=_val;
	}

	//TODO: I am sure this is wrong. For many reasons.
	integrate_y(_delta, _factor) {
//		let copy=this.copy();
		this.y+=_factor * _delta;
//		this.add_value(_factor * _delta);
		//TODO: What the hell is this returning???? A vector... 
//		return (copy + vec) * 0.5 * _delta;
	}

	copy() {
		return new vector_2d(this.x, this.y);
	}
};
