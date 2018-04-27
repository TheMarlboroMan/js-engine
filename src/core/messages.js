"use strict"

/*
We need
- The kernel should dispatch the message to the controllers who request it.
- We should be able to specify "all" controllers.
- What if we want to send a message to a component?  Well, that's  a controller too XD!.
*/


export class message {
	constructor(_type, _body, _recipients) {

		if(! (_recipients instanceof Array)) {
			throw new Error("Recipients must be an array");
		}

		//!The type is open. Whatever you want it to be.
		this.type=_type;
		//!Same can be said for the body :).
		this.body=_body;
		//!A message without recipients is broadcasted to everybody!
		this.recipients=_recipients;
	}
}

export class message_queue {

	constructor() {
		this.queue=new Array();
	}

	get_length() {
		return this.queue.length;
	}

	get_queue() {
		return this.queue;
	}

	clear() {
		this.queue.length=0;
	}
}

//!To be injected in every controller.
export class messenger {

	constructor(_message_queue) {

		if(!(_message_queue instanceof message_queue)) {
			throw new Error("Invalid message_queue for messenger");
		}

		//!this.queue is actually a reference to the "message_queue" queue.
		this.queue=_message_queue.get_queue();
	}

	send(_message) {
		if(!( _message instanceof message)) {
			throw new Error('Invalid message');
		}

		this.queue.push(_message);
	}
}
