"use strict"

export class resource_manager {

	constructor() {

		this.images={};
	}

	//!Chainable. 
	load_image(_src, _key) {

		return new Promise((_ok, _err) => {

			if(undefined!==this.images[_key]) {
				_err("Unable to overwrite resource "+_key);
			}

			let img=new Image();
			img.onload=function() {_ok(this);}
			img.src=_src;
		})
		.then((_loadedimg) => {
			this.images[_key]=_loadedimg;
			return true;
		});
	}

	get_image(_key) {

		if(undefined===this.images[_key]) {
			throw new error("Unable to retrieve resource "+_key);
		}
		return this.images[_key];
	}
}
