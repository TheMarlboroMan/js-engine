"use strict"

import {state_controller} from './state_controller.js';
import {messenger, message} from './messages.js';

//!This is the base controller.
export class controller {

	constructor() {
		this.state_controller=null;
		this.messenger=null;
	}

	setup_state_and_messenger(_state_controller, _messenger) {

		if(!(_state_controller instanceof state_controller)) {
			throw new Error("Invalid state controller");
		}

		if(!(_messenger instanceof messenger)) {
			throw new Error("Invalid messenger");
		}

		this.state_controller=_state_controller;
		this.messenger=_messenger;
	}

	do_step(_delta, _input, _audio) {
		//Implemented by the derived class.
	}

	do_draw(_display_control) {
		//To be implemented by the derived class.
	}

	do_receive_message(_message) {
		//To be implemented by the derived class.
	}

	awake() {
		//Called when it is brought as the main controller, also when
		//the kernel starts the first controller.
	}

	slumber() {
		//Called when it is sent into the background and replaced by another
		//controller as main.
	}
}
