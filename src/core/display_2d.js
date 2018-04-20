"use strict"

export class display_2d {

	constructor(_w, _h, _parent) {
		this.canvas=document.createElement('canvas');
		this.canvas.width=_w;
		this.canvas.height=_h;
		_parent.appendChild(this.canvas);

		this.context=this.canvas.getContext("2d");
	}
}
