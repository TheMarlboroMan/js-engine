"use strict"

import {message} from '../core/messages.js';
import {controller} from '../core/controller.js';
import {display_2d_manipulator} from '../core/display_2d_manipulator.js';
import {rgb_color} from '../core/display_tools.js';

export class intro_controller extends controller {

	constructor() {
		super();
		this.clear_color=new rgb_color(0, 0, 0);
		this.sent=false;
	}

	do_step(_delta, _input) {

		if(!this.sent) {

			this.sent=true;
			this.messenger.send(new message('load_map', 'assets/map.json', ['map_load']));
			this.state_controller.request_state_change("map_load");
		}
	}

	do_draw(_display_control) {
		display_2d_manipulator.fill(_display_control.display, this.clear_color);
	}

	do_receive_message(_message) {

	}

	awake() {
		console.log("intro controller is awake");
	}

	slumber() {
		console.log("intro controller goes to slumber");
	}
}
