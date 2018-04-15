"use strict"

import {state_controller} from './state_controller.js';
import {messenger, message} from './messenger.js';

//!This is the base controller.
export class controller {

	constructor() {
		this.state_controller=null;
		this.messenger=null;
	}

	setup_state_and_messenger(_state_controller, _messenger) {

		if(! _state_controller instanceof state_controller) {
			throw new Error("Invalid state controller");
		}

		if(!_messenger instanceof messenger) {
			throw new Error("Invalid messenger");
		}

		this.state_controller=_state_controller;
		this.messenger=_messenger;
	}

	receive_message(_message) {
		if(! _message instanceof message) {
			throw new Error("Invalid message received");
		}

		//TODO: The interpreter...Oh damn. How do I call a function in the derived class???
	}
}
