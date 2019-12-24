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
		this.keydownsguard=create_keymap(_filter_map);
		this.keyups=create_keymap(_filter_map);
		this.keypresses=create_keymap(_filter_map);

		this.keydown_listener=(_event) => {this.handle_event(_event, this.keydowns, 'down');};
		this.keyup_listener=(_event) => {this.handle_event(_event, this.keyups, 'up');};
//TODO: Can do better. Keypresses cannot detect arrow keys.
//		this.keypress_listener=(_event) => {this.handle_event(_event, this.keypresses, 'press');};

		//This looks like keycode : 'keyname';
		this.reverse_map=create_reverse_lookup(_filter_map);

		this.quick_access={'down' : false, 'up' : false, 'press' : false};
	}

	activate() {
		document.addEventListener('keydown', this.keydown_listener, false);
		document.addEventListener('keyup', this.keyup_listener, false);
//		document.addEventListener('keypress', this.keypress_listener, false);
	}

	deactivate() {
		document.removeEventListener('keydown', this.keydown_listener, false);
		document.removeEventListener('keyup', this.keyup_listener, false);
//		document.removeEventListener('keypress', this.keypress_listener, false);
	}

	handle_event(_event, _map, _quick) {

		if(undefined!==this.reverse_map[_event.keyCode]) {

			let key=this.reverse_map[_event.keyCode];

			//TODO: Can do better. Keypresses cannot detect arrow keys.
			switch(_quick) {//Equivalent to switch event.type
				//This seems to be... "press".
//				default: 
//					_map[key]=true;
//					this.quick_access[_quick]=true;
//				break;
				case 'up':
					_map[key]=true;
					this.quick_access[_quick]=true;

					this.keydowns[key]=false;
					this.keypresses[key]=false;
					this.keydownsguard[key]=false;					
					this.quick_access['down']=false;
				break;
				case 'down':
					_map[key]=!this.keydownsguard[key];
					this.keydowns[key]=true;
					this.keypresses[key]=true;
					this.keydownsguard[key]=true;
				break;
			}
		}
	}

	//!After each loop, keydowns are cleared, as polling speed is fixed
	//!and may not be in sync with the controllers.
	clear_keydowns() {
		clear(this.keydowns);
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
