"use strict"

export class input_keymap_creator {

	constructor() {
		this.keymap={};
	}

	add(_k, _v) {
		if('string' !== typeof _k) {
			throw new Error("Keys must be strings for the input keymap creator");
		}

		if('number' !== typeof _v) {
			throw new Error("Values must be numbers for the input keymap creator");
		}

		if(undefined!== this.keymap[_k]) {
			throw new Error("Key "+_k+" was already defined in the input keymap creator");
		}

		this.keymap[_k]=_v;
	}

	get_keymap() {
		return this.keymap;
	}

}
