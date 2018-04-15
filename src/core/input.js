"use strict";

function clear(_map) {
	for(let k in _map) {
		_map[k]=false;
	}
}

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

		this.keydown_listener=(_event) => {this.handle_event(_event, this.keydowns, 'down');};
		this.keyup_listener=(_event) => {this.handle_event(_event, this.keyups, 'up');};

		//This looks like keycode : 'keyname';
		this.reverse_map=create_reverse_lookup(_filter_map);

		//This looks like {up: false, down: false...}
		this.keydowns=create_keymap(_filter_map);
		this.keyups=create_keymap(_filter_map);

		this.quick_access={'down' : false, 'up' : false};
	}

	activate() {
		document.addEventListener('keydown', this.keydown_listener, false);
		document.addEventListener('keyup', this.keyup_listener, false);
	}

	deactivate() {
		document.removeEventListener('keydown', this.keydown_listener, false);
		document.removeEventListener('keyup', this.keyup_listener, false);
	}

	handle_event(_event, _map, _quick) {
		if(undefined!==this.reverse_map[_event.keyCode]) {
			_map[this.reverse_map[_event.keyCode]]=true;
			this.quick_access[_quick]=true;
		}
	}

	clear() {
		clear(this.keydowns);
		clear(this.keyups);
		clear(this.quick_access);
	}

	check_event(_key, _map) {
		if(undefined===_map[_key]) {
			throw new Error("unknown key "+_key+" when checking event");
		}
		return _map[_key];
	}

	is_keydown(_key) {
		return this.check_event(_key, this.keydowns);
	}

	is_keyup(_key) {
		return this.check_event(_key, this.keyups);
	}

	is_any_keydown() {
		return this.quick_access['down'];
	}

	is_any_keyup() {
		return this.quick_access['up'];
	}
}
