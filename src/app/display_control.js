"use strict";

import {display_2d} from '../core/display_2d.js';

export class display_control {

	constructor() {
		this.display=new display_2d(640, 400, document.getElementById('container'));
		this.display.canvas.focus();
	}


}