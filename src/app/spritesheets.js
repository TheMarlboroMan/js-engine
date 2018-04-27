"use strict"

import {point_2d} from '../core/point_2d.js';

function pt(_x, _y) {
	return new point_2d(_x, _y);
}

let hero={
	'stand' : [pt(0, 0)],
	'hurt' : [pt(64, 0), pt(96, 0)],
	'walk' : [pt(0, 32), pt(32, 32), pt(64, 32), pt(96, 32)],
	'attack' : [pt(0, 64)],
	'guard' : [pt(0, 96)]
};

export class spritesheets {

	//TODO: Check data.
	static get_hero(_key, _frame) {
		return hero[_key][_frame];
	}
};
