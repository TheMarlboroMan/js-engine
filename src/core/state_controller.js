"use strict"
//!There's only one of these: property of the kernel. It is injected into the rest.
export class state_controller {

	constructor() {
		this.next_state=null;
	}

	request_state_change(_ns) {
		this.next_state=_ns;
	}

	is_request_state_change() {
		return null!==this.next_state;
	}

	clear_state_change() {
		this.next_state=null;
	}

	get_requested_state() {
		return this.next_state;
	}
}
