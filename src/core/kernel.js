"use strict";

import {input} from './input.js';
import {state_controller} from './state_controller.js';
import {messenger, message_queue} from './messages.js';
import {resource_manager} from './resource_manager.js';
import {input_keymap_creator} from './input_tools.js';

export class kernel {

	constructor() {
		this.last_step=null;
		this.loop_interval=null;
		this.display_control=null;
		this.input=null;
		this.controllers={};
		this.active_controller=null;
		this.app_resource_load_class=null;

		this.running=false;

		this.state_controller=new state_controller();
		this.message_queue=new message_queue();
		this.resource_manager=new resource_manager();
	}

	//!Display control is not actually defined as anything: is just anything 
	//!the application defines to draw :).
	setup(_dc, _km) {
		this.display_control=_dc;

		let ifc=new input_keymap_creator();
		for(let i in _km) {
			ifc.add(i, _km[i]);
		}

		this.input=new input(ifc.get_keymap());
	}

	inject_controller(_key, _controller) {

		if(undefined!==this.controllers[_key]) {
			throw new Error("controller "+_key+" was already injected");
		}

		_controller.setup_state_and_messenger(this.state_controller, new messenger(this.message_queue));
		this.controllers[_key]=_controller;
	}

	set_app_resource_load_class(_obj) {
		//TODO: Check it is an object.
		//TODO: Check is has the "load" method.
		//TODO: Assign.
	}

	init_loading_phase(_resources) {

		let promises=Array();
		for(let i in _resources) {
			//Oh well...
			let p=new Promise((_ok, _err) => {
				return this.resource_manager.load_image(_resources[i], i)
					.then((_res) => {_ok(_res);});
			});
			promises.push(p);
		}

		return Promise.all(promises)
		.then(() => {
			if(this.app_resource_load_class) {
				return this.app_resource_load_class.load();
			}
			else {
				return true;
			}
		})
		.catch((_err) => {console.error('Something failed in the loading phase', _err);});
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
		try {
			var now=Date.now();
			this.delta=(now-this.last_step) / 1000.0;
			this.last_step=now;

			//TODO: Maybe this should be setup too...
			if(this.delta > 50.0) this.delta=50.0;

	//		this.input.clear(); //It doesn't work like this...
			this.active_controller.do_step(this.delta, this.input);

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
		catch(_error) {
			console.error(_error);
			console.log("Stopping...");
			this.stop();
		}
	}

	draw() {
		this.active_controller.do_draw(this.display_control, this.resource_manager);
		requestAnimationFrame( () => {this.draw();}); 
	}

	dispatch_messages() {
		//Consume the queue.
		this.message_queue.get_queue().forEach( (_message) => {
			if(!_message.recipients.length) {
				for(let c in this.controllers) {
					this.controllers[c].do_receive_message(_message);
				}
			}
			else {
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
