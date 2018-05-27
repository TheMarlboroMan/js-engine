"use strict"

import {rect} from '../core/rect.js';
import {point_2d} from '../core/point_2d.js';
import {room_object} from './room_object.js';

export const tile_w=16;
export const tile_h=16;

const type_solid=1;
const type_platform=2;
const type_block_enemy=3;
const type_deadly=5;

export class tile extends room_object {
	constructor(_x, _y, _t) {
		super(new rect(new point_2d(_x*tile_w, _y*tile_h), tile_w, tile_h));
		this.type=_t;
	}

	is_solid() {
		return type_solid==this.type;
	}

	is_deadly() {
		return type_deadly==this.type;
	}

	//!Platform means "can be jumped on from below".
	is_platform() {
		return type_platform==this.type;
	}

	blocks_enemies() {
		return type_block_enemy==this.type;
	}
};
