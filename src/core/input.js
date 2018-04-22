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

		//This looks like {up: false, down: false...}
		this.keydowns=create_keymap(_filter_map);
		this.keyups=create_keymap(_filter_map);
		this.keypresses=create_keymap(_filter_map);

		this.keydown_listener=(_event) => {this.handle_event(_event, this.keydowns, 'down');};
		this.keyup_listener=(_event) => {this.handle_event(_event, this.keyups, 'up');};
		this.keypress_listener=(_event) => {this.handle_event(_event, this.keypresses, 'press');};

		//This looks like keycode : 'keyname';
		this.reverse_map=create_reverse_lookup(_filter_map);

		this.quick_access={'down' : false, 'up' : false, 'press' : false};
	}

	activate() {
		document.addEventListener('keydown', this.keydown_listener, false);
		document.addEventListener('keyup', this.keyup_listener, false);
		document.addEventListener('keypress', this.keypress_listener, false);
	}

	deactivate() {
		document.removeEventListener('keydown', this.keydown_listener, false);
		document.removeEventListener('keyup', this.keyup_listener, false);
		document.removeEventListener('keypress', this.keypress_listener, false);
	}

	handle_event(_event, _map, _quick) {

		//TODO: Okay, when the event is down we should prevent repeats...
		//TODO... Oh well, this is NOT working.
		//TODO: I can clearly see the problem: the events are not in
		//sync with the application and can interrupt the flow at any
		//time... Perhaps we could do a combo of BLOCK-CLEAR-UNLOCK
		//when we don't allow new events before the controller loop
		//and we clear the keydowns after it. We could just try.

		if(undefined!==this.reverse_map[_event.keyCode]) {

			let key=this.reverse_map[_event.keyCode];

			//TODO: Check if there's more to do below...
			if(_quick==='down') {
				console.log("DOWN "+_event.repeat);
				if(_event.repeat) {
					_map[key]=false;
					return;
				}
			}

			_map[key]=true;
			this.quick_access[_quick]=true;

			if(_quick==='up') {
				this.keydowns[key]=false;
				this.keypresses[key]=false;
				this.quick_access['down']=false;
			}
		}
	}

/*
	clear() {
		clear(this.keydowns);
		clear(this.keyups);
		clear(this.keypresses);
		clear(this.quick_access);
	}
*/

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

	is_keypressed(_key) {
		return this.check_event(_key, this.keypresses);
	}

	is_any_keydown() {
		return this.quick_access['down'];
	}

	is_any_keyup() {
		return this.quick_access['up'];
	}
}
