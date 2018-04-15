"use strict"
//!This is the base controller.
export class controller {

	constructor() {
		this.state_controller=null;
		this.messenger=null;
	}

	setup_state_and_messenger(_state_controller, _messenger) {
		if(instanceof _state_controller !== 'state_controller') {
			throw new Error("Invalid state controller");
		}

		if(instanceof _messenger !== 'messenger') {
			throw new Error("Invalid messenger");
		}

		this.state_controller=_state_controller;
		this.messenger=_messenger;
	}

	//TODO: Move all shit into place!

	send_message(_message) {

	}

	//let next_state=null;

	request_state_change(_ns) {
		next_state=_ns;
	}

	is_request_state_change() {
		return null!==next_state;
	}

	clear_state_change() {
		next_state=null;
	}

	get_requested_state() {
		return next_state;
	}
}
