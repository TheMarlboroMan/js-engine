"use strict"

import {resource_loader as rl} from '../core/resource_loader.js';

export class resource_loader extends rl {

	constructor() {
		super();
		this.irl.add_image('sprites', 'assets/MiniKnightSet.png');
		this.irl.add_image('tiles', 'assets/background_16.png');
	}
}
