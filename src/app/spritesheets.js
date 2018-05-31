"use strict"

import {point_2d} from '../core/point_2d.js';
import {rect} from '../core/rect.js';

function pt(_x, _y) {
	return new point_2d(_x*32, _y*32);
}

let hero={
	'stand' : [pt(0, 0)],
	'hurt' : [pt(2, 0), pt(3, 0)],
	'walk' : [pt(0, 1), pt(1, 1), pt(2, 1), pt(3, 1)],
	'attack' : [pt(0, 2)],
	'guard' : [pt(0, 3)]
};

let enemy={
	'stand' : [pt(0, 4)],
	'hurt' : [pt(2, 4), pt(3, 4)],
	'walk' : [pt(0, 5), pt(1, 5), pt(2, 5), pt(3, 5)],
	'attack' : [pt(0, 6)],
	'guard' : [pt(0, 7)]
};

export class spritesheets {

	//TODO: Check data.
	static get_hero_rect(_key, _frame) {
		return new rect(hero[_key][_frame], 32, 32);
	}

	static get_enemy_rect(_key, _frame) {
		return new rect(enemy[_key][_frame], 32, 32);
	}
};
