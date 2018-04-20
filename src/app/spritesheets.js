"use strict"

class point {
	constructor(_x, _y) {
		this.x=_x; 
		this.y=_y;
	}
};

function pt(_x, _y) {
	return new point(_x, _y);
}

//let dimensions={w:32, h:32};

let hero={
	'stand' : [pt(0, 0)],
	'hurt' : [pt(64, 0), pt(96, 0)],
	'walk' : [pt(0, 32), pt(32, 32), pt(64, 32), pt(96, 32)],
	'attack' : [pt(0, 64)],
	'guard' : [pt(0, 96)]
};

let scenery={
	'solid' : [pt(96, 96)],
	'bridge-left' : [pt(0, 96)],
	'bridge-center' : [pt(32, 96)],
	'bridge-right' : [pt(64, 96)]
};

export class spritesheets {

	//TODO: Check data.
	static get_hero(_key, _frame) {
		return hero[_key][_frame];
	}

	static get_scenery(_key, _frame) {
		return scenery[_key][_frame];
	}
};
