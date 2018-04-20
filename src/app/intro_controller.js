"use strict"

import {message} from '../core/messages.js';
import {controller} from '../core/controller.js';
import {display_2d_manipulator} from '../core/display_2d_manipulator.js';
import {rgb_color} from '../core/display_tools.js';
import {rect} from '../core/rect.js';

export class intro_controller extends controller {

	constructor() {
		super();
		this.clear_color=new rgb_color(0, 0, 0);
	}

	do_step(_delta, _input) {

		if(_input.is_keydown('up')) {
			this.clear_color=new rgb_color(0, 0, 0);
		}
		else if(_input.is_keydown('down')) {
			this.clear_color=new rgb_color(255, 0, 0);
		}
		else if(_input.is_keydown('space')) {
			this.state_controller.request_state_change("main");
		}
		else if(_input.is_keydown('enter')) {
			this.messenger.send(new message(1, "Hola", ["main"]));
		}
	}

	do_draw(_display_control, _rm) {
		display_2d_manipulator.fill(_display_control.display, this.clear_color);

		let pos=new rect(32, 32, 32, 32);
		let clip=new rect(100, 100, 32, 32);

		display_2d_manipulator.draw_sprite(_display_control.display, _rm.get_image('sprites'), pos, clip);
	}

	do_receive_message(_message) {
		console.log("intro controller got ", _message);
	}
}
