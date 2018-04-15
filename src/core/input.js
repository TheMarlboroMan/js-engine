"use strict";

function create_reverse_lookup(_map) {
	let result={};
	for(let k in _map) {
		result[_map[k]]=k;
	}
	return result;
}

function create_keymap(_map) {
	let result={};
	for(let k in _map) {
		result[k]=false;
	}
	return result;
}

export class input {
	constructor(_filter_map) {

		//TODO: We could actually use a class we provide and encapsulate... like set('up', 32), etc...
		//TODO: That's actually much better than this approach.
		if('object' !== typeof _filter_map) {
			throw new Error("A valid filter map is necessary to build the input");
		}

		this.listeners=new Array();
		this.filter_map=_filter_map;
		this.reverse_map=create_reverse_lookup(this.filter_map);
		this.keydowns=create_keymap(this.filter_map);

		document.addEventListener('keydown', (event) => {this.handle_keydown(event);});
	}

	handle_keydown(_event) {
		if(undefined!==this.reverse_map[_event.keyCode]) {
			this.keydowns[_event.keyCode]=true;
		}
	}

	clear() {
		for(let k in this.keydowns) {
			this.keydowns[k]=false;
		}
	}

	is_keydown(_key) {
		if(undefined===this.filter_map[_key]) {
			throw new Error("unknown key for is_keydown");
		}
		return this.keydowns[this.reverse_map[_key]];
	}
}
