"use strict"

//!This class is just a list of all the different containers present in a map.
//!It is designed so it is known to the deleter.

export class room_data_container {
	constructor() {
		//Tiles is a hashed map, where the key is the index as returned
		//by get_index.
		this.tiles={};
		this.background=[];

		this.entries=[];
		this.exits=[];
		this.enemies=[];

		this.player_attacks=[];
	}

	clear() {
		this.tiles={};
		this.background.length=0;
		this.entries.length=0;
		this.exits.length=0;
		this.enemies.length=0;
		this.player_attacks.length=0;
	}
}
