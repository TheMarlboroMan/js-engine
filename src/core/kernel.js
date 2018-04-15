"use strict";

import {input} from './input.js';
import {state_controller} from './state_controller.js';
import {messenger, message_queue} from './messages.js';

export class kernel {

	constructor() {
		this.last_step=null;
		this.loop_interval=null;
		this.display_control=null;
		this.input=null;
		this.state_controller=null;
		this.message_queue=null;
		this.controllers={};
		this.active_controller=null;
		this.running=false;
	}

	//!Display control is not actually defined as anything: is just anything 
	//!the application defines to draw :).
	setup(_dc, _km) {
		this.display_control=_dc;
		this.input=new input(_km);
		this.state_controller=new state_controller();
		this.message_queue=new message_queue();
	}

	inject_controller(_key, _controller) {

		if(null===this.state_controller) {
			throw new Error("kernel must be setup before controllers can be injected");
		}

		if(undefined!==this.controllers[_key]) {
			throw new Error("controller "+_key+" was already injected");
		}

		_controller.setup_state_and_messenger(this.state_controller, new messenger(this.message_queue));
		this.controllers[_key]=_controller;
	}

	set_active_controller(_key) {
		if(undefined===this.controllers[_key]) {
			throw new Error("cannot activate non-existing controller "+_key+"");
		}

		this.active_controller=this.controllers[_key];
	}

	is_init() {
		return null!==this.display_control
			&& null!==this.input
			&& null!==this.message_queue
			&& null!==this.state_controller;
	}

	stop() {
		if(!this.started) {
			throw new Error("kernel was not started");
		}

		this.input.deactivate();
		clearInterval(this.loop_interval);
		cancelAnimationFrame(null);
	}

	start() {
		if(this.started) {
			throw new Error("kernel was already started");
		}

		if(!this.is_init()) {
			throw new Error("kernel was not correctly setup");
		}

		if(null===this.active_controller) {
			throw new Error("active controller is not set");
		}

		this.started=true;
		this.input.activate();
		this.last_step=Date.now();
		this.loop_interval=setInterval(()=>{this.loop()}, 16.666);
		requestAnimationFrame( () => {this.draw();});
	}

	loop(_delta) {
		var now=Date.now();
		this.delta=(now-this.last_step) / 1000.0;
		this.last_step=now;

		//TODO: Maybe this should be setup too...
		if(this.delta > 50.0) this.delta=50.0;

		this.active_controller.do_step(this.delta, this.input);
		this.input.clear();

		if(this.message_queue.get_length()) {
			this.dispatch_messages();
		}

		if(this.state_controller.is_request_state_change()) {

			let requested_state=this.state_controller.get_requested_state();

			if(undefined===this.controllers[requested_state]) {
				throw new Error("State requested '"+requested_state+"' does not exist");
			}

			this.active_controller=this.controllers[requested_state];
			this.state_controller.clear_state_change();
		}
	}

	draw() {
		this.active_controller.do_draw(this.display_control);
		requestAnimationFrame( () => {this.draw();}); 
	}

	dispatch_messages() {
		//Consume the queue.
		this.message_queue.get_queue().forEach( (_message) => {
			if(!_message.recipients.length) {
console.log("pure broadcast!");
				for(let c in this.controllers) {
console.log(c);
					c.do_receive_message(_message);
				}
			}
			else {
console.log("specific message!");
				_message.recipients.forEach( (_key) => {
					if(undefined===this.controllers[_key]) {
						throw new Error("Invalid message recipient "+_key);
					}
					this.controllers[_key].do_receive_message(_message);
				});
			}
		});

		//Clear it.
		this.message_queue.clear();
	}
}
