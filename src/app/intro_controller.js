"use strict"

import {controller} from '../core/controller.js';
import {display_2d_manipulator} from '../core/display_2d_manipulator.js';
import {rgb_color} from '../core/display_tools.js';

export class intro_controller extends controller {

	constructor() {
		this.clear_color=new rgb_color(0, 0, 0);
	}

	do_step(_delta, _input) {

		if(_input.is_keydown('up')) {
			this.clear_color=new rgb_color(0, 0, 0);
		}
		else if(_input.is_keydown('down')) {
			this.clear_color=new rgb_color(255, 0, 0);
		}

	}

	do_draw(_display_control) {
		display_2d_manipulator.fill(_display_control.display, this.clear_color);
	}
}
