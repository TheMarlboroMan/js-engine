"use strict"

import {resource_index as ri} from '../core/resource_index.js';

export class resource_index extends ri {

	constructor() {
		super();
		this.add_image('sprites', 'assets/graphics/MiniKnightSet.png');
		this.add_image('tiles', 'assets/graphics/background.png');
		this.add_audio('main_music', 'assets/audio/snowfall.ogg');
		this.add_audio('fx1', 'assets/audio/1.wav');
		this.add_audio('fx2', 'assets/audio/2.wav');
		this.add_audio('fx3', 'assets/audio/3.wav');
		this.add_audio('fx4', 'assets/audio/4.wav');
		this.add_audio('fx5', 'assets/audio/5.wav');
	}
}
