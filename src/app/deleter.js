"use strict"

import {room_data_container} from './room_data_container.js';
import {player_attacks} from './room_object.js';

export class deleter {

	constructor() {

		this.collected=[];
	}

	collect(_deletable) {

		this.collected.push(_deletable);
	}

	can_perform_deletion() {

		return this.collected.length;
	}

	perform_deletion(_rdc) {

		if(!(_rdc instanceof room_data_container)) {
			throw new Error("perform_deletion must be invoked with a room_data_container");
		}

		this.collected.forEach((_item) => {

			let collection=null;
			switch(_item.get_collection_id()) {
				case player_attacks:
					collection=_rdc.player_attacks; 
				break;
			}

			if(null!==collection) {
				let index=collection.indexOf(_item);
				if(-1===index) {
					throw new Error("Could not find deletable in array");
				}

				collection.splice(index, 1);
			}
		});

		this.collected.length=0;
	}
}
