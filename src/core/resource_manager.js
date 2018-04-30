"use strict"

export class resource_manager {

	constructor() {

		this.images={};
		this.audio={};
	}

	//!Chainable. 
	load_image(_src, _key) {
		return new Promise((_ok, _err) => {

			if(undefined!==this.images[_key]) {
				_err("Unable to overwrite resource "+_key);
			}

			let img=new Image();
			//TODO: Use events...
			//TODO: Add error.
			img.onload=function() {_ok(this);}
			img.onerror=function() {_err(this);}
			img.src=_src;
		})
		.then((_loaded_img) => {
			this.images[_key]=_loaded_img;
			return true;
		});
	}

	load_audio(_src, _key) {

		return new Promise((_ok, _err) => {
			let a=new Audio();
			a.preload='auto';
			let fn=(_res) => {
				a.volume=0;
				a.play();
				a.pause();
				a.removeEventListener('canplaythrough', ev, true);
				a.removeEventListener('error', everr, true);
				_ok(_res);
			};
			let fn_err=(_res) => {
				a.removeEventListener('canplaythrough', ev, true);
				a.removeEventListener('error', everr, true);
				_err(_res);
			}
			let ev=a.addEventListener('canplaythrough', fn, true);
			let everr=a.addEventListener('error', fn_err, true);
			a.src=_src;
		})
		.then((_loaded_audio) => {
			this.audio[_key]=_loaded_audio;
			return true;
		});
	}

	get_image(_key) {

		if(undefined===this.images[_key]) {
			throw new error("Unable to retrieve image resource "+_key);
		}
		return this.images[_key];
	}

	get_audio(_key) {

		if(undefined===this.audio[_key]) {
			throw new error("Unable to retrieve audio resource "+_key);
		}
		return this.audio[_key];
	}
}
