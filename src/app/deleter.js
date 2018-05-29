"use strict"

import {room_data_container} from './room_data_container.js';

export class deleter {

	constructor(_rdc) {

		if(!(_rdc instanceof room_data_container)) {
			throw new Error("deleter must be created with a room_data_container");
		}

		this.rdc=_rdc;
		this.collected=[];
	}

	collect(_deletable) {

		this.collected.push_back(_deletable);
	}

	can_perform_deletion() {

		return this.collected.length;
	}

	perform_deletion() {

		this.collected.forEach((_item) => {
			//TODO: Must be able to collect EVERYTHING.
			let index=_rdc.player_attacks.indexOf(_item);
			if(-1===index) {
				throw new Error("Could not find deletable in array");
			}

			_rdc.player_attacks.splice(index, 1);
		}

		this.collected.length=0;
	}
}
