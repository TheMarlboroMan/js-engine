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

		if('object' !== typeof _filter_map) {
			throw new Error("A valid filter map is necessary to build the input");
		}

		this.listeners=new Array();

		//This looks like keycode : 'keyname';
		this.reverse_map=create_reverse_lookup(_filter_map);

		//This looks like {up: false, down: false...}
		this.keydowns=create_keymap(_filter_map);

		this.quick_access={'down' : false};

		document.addEventListener('keydown', (_event) => {this.handle_keydown(_event);});
	}

	handle_keydown(_event) {
		if(undefined!==this.reverse_map[_event.keyCode]) {
			this.keydowns[this.reverse_map[_event.keyCode]]=true;
			this.quick_access['down']=true;
		}
	}

	clear() {
		for(let k in this.keydowns) {
			this.keydowns[k]=false;
		}

		for(let k in this.quick_access) {
			this.quick_access[k]=false;
		}
	}

	is_keydown(_key) {
		if(undefined===this.keydowns[_key]) {
			throw new Error("unknown key for is_keydown");
		}
		return this.keydowns[_key];
	}

	is_any_keydown() {
		return this.quick_access['down'];
	}
}
