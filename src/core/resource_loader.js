"use strict"

export class image_resource_list {

	constructor() {
		this.resources={};
	}

	add_image(_key, _file) {
		if(undefined!==this.resources[_key]) {
			throw new Error("key "+_key+" was already registered in image_resource_list");
		}

		this.resources[_key]=_file;
	}
}

//!Base class for resource loaders.
export class resource_loader {

	constructor() {
		this.irl=new image_resource_list();
	}
}
