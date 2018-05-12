"use strict"

import {message} from '../core/messages.js';
import {controller} from '../core/controller.js';
import {display_2d_manipulator} from '../core/display_2d_manipulator.js';
import {rgb_color} from '../core/display_tools.js';
import {map_loader, map} from './map_loader.js';

export class map_load_controller extends controller {

	constructor() {
		super();
		this.map=null;
		this.status=0;
	}

	do_step(_delta, _input, _audio) {
		switch(this.status) {
			case 0: //Loading

			break;
			case 1:	//Loaded...
				this.messenger.send(new message('map_loaded', this.map, ['game']));
				this.map=null;
				this.status=0;
				this.state_controller.request_state_change("game");
			break;
		}
	}

	do_draw(_display_control) {
		display_2d_manipulator.fill(_display_control.display, new rgb_color(0, 0, 0));
	}

	do_receive_message(_message) {
		switch(_message.type) {
			case 'load_map':
				this.status=0;
				let mapname='assets/maps/'+_message.body+'.json';
				map_loader.load_from_url(mapname)
				.then((_map) => {
					if(_map.failed) {
						throw new Error("Could not load the map "+mapname);
					}
					else {
						this.status=1;
						this.map=_map;
					}
				});
	//TODO Where's the catch dude???
			break;
		}
	}

	awake() {
		console.log("map load controller is awake");
	}

	slumber() {
		console.log("map load goes to slumber");
	}
}
