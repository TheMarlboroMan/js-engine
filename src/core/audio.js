"use strict"

export class audio_channel {
	constructor(_index) {
		this.index=_index;
		this.audio=new Audio();
		this.playing=false;

		this.stopEvent=this.audio.addEventListener('ended', () => {this.on_stop()}, true);
	}

	is_idle() {
		return !this.playing;
	}

	play(_source, _looped) {
		//TODO: Use the resolver here,
		this.audio.src=_source;
		this.audio.loop=_looped;
		this.audio.play();
		this.playing=true;
	}

	on_stop() {
		this.playing=false;
	}

	stop() {
		this.on_stop();
	}
}

export class audio_manager {
	constructor(_max_channels) {
		this.channels=[];
		for(let i=0; i<_max_channels; i++) {
			this.channels.push(new audio_channel(i));
		}
	}

	play(_source, _looped=false) {

		let cn=this.get_idle_channel();
		if(!cn) {
			return false;
		}
		cn.play(_source, _looped);
		return cn.index;
	}

	get_idle_channel() {
		for(let i=0; i<this.channels.length; i++) {
			if(this.channels[i].is_idle()) {
				return this.channels[i];
			}
		}
		return null;
	}

	stop_channel(_index) {
		if(undefined!==this.channels[_index]) {
			this.channels[_index].stop();
		}
	}

	stop_all() {
		this.channels.forEach((_item) => {_item.stop();});
	}

	get_channel(_index) {
		if(undefined===this.channels[_index]) {
			throw new Error('get_channel got invalid index' , _index);
		}

		return this.channels[_index];
	}
}

