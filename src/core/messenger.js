"use strict"

/*
We need
- a message queue.
- the ability to consume them.
- separate que queue from the other thing.
- The kernel should dispatch the message to the controllers who request it.
- We should be able to specify "all" controllers.
- What if we want to send a message to a component?  Well, that's  a controller too XD!.
- We need a message class.
*/


export class message {
	constructor {_body, _recipients} {

		if(! _recipients instanceof Array) {
			throw new Error("Recipients must be an array");
		}

		this.body=_body;
		this.recipients=_recipients;
	}
}

export class messenger {
	//TODO: Do this for real.

	send_message(_message) {
		if(! _message instanceof message) {
			throw new Error('Invalid message');
		}
	}
}
