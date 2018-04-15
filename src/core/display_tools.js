"use strict"

export class rgb_color {
	constructor(_r, _g, _b) {
		this.r=_r;
		this.g=_g;
		this.b=_b;
	}

	as_style() {
		return 'rgb('+this.r+','+this.g+','+this.b+')';
	}
}

export class rgba_color extends rgb_color{
	constructor(_r, _g, _b, _a) {
		super(_r, _g, _b);
		this.a=_a;
	}

	as_style() {
		return 'rgba('+this.r+','+this.g+','+this.b+', '+this.a+')';
	}
}
