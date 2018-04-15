"use strict"

import {controller} from '../core/controller.js';
import {display_2d_manipulator} from '../core/display_2d_manipulator.js';
import {rgb_color} from '../core/display_tools.js';

export class main_controller extends controller {

	constructor() {
		super();
		this.clear_color=new rgb_color(0, 0, 255);
	}

	do_step(_delta, _input) {
		if(_input.is_keydown('space')) {
			this.state_controller.request_state_change("intro");
		}
	}

	do_draw(_display_control) {
		display_2d_manipulator.fill(_display_control.display, this.clear_color);
	}
}
