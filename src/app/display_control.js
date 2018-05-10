"use strict";

import {display_2d} from '../core/display_2d.js';

export class display_control {

	constructor() {

		//Fits a world of 20x13 in 16x16... Can be done 22x15 so there are hard limits.
		this.display=new display_2d(320, 208, document.getElementById('container'));
		this.display.canvas.focus();
	}
}
