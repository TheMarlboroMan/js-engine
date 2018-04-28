"use strict"

export class resource_list {

	constructor() {
		this.resources={};
	}

	add(_key, _file) {
		if(undefined!==this.resources[_key]) {
			throw new Error("key "+_key+" was already registered in resource_list");
		}

		this.resources[_key]=_file;
	}
}

//!Base class for resource loaders.
export class resource_index {

	constructor() {
		this.irl=new resource_list();
		this.arl=new resource_list();
	}

	add_image(_key, _src) {
		this.irl.add(_key, _src);
	}

	add_audio(_key, _src) {
		this.arl.add(_key, _src);
	}
}
