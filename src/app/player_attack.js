"use strict"

import {room_object} from './room_object.js';

//TODO: How do I attach this to the room.
export class player_attack extends room_object {

	constructor(_rect) {
		super(_rect);
		this.remaining_time=0.5;
	}

	loop(_delta) {
			//TODO: Extinguish the time.
			//TODO: When the time is done, it will need to be deleted, you see...
			//TODO: In order for us to actually do this, we would have to add some sort of listener pattern.
	}

}
