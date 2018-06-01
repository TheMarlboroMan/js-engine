"use strict"

import {rect} from '../core/rect.js';
import {deleter} from './deleter.js';

export const facing_right=1;
export const facing_left=0;

export const player_attacks_collect=0;
export const enemies_collect=1;

export class room_object {

	constructor(_rect, _gc) {

		if(!(_gc instanceof deleter)) {
			throw new Error("room_object must be constructed with a deleter");
		}

		if(!(_rect instanceof rect)) {
			throw new Error("room_object must be built from a rect");
		}
		this.position=_rect.clone();
		this.deleter=_gc;
	}

	get_position() {
		return this.position;
	}

	mark_for_deletion() {
		this.deleter.collect(this);
	}

	move_to(_pt) {
		if(!(_pt instanceof point_2d)) {
			throw new Error("move_to must get a point_2d");
		}

		this.position.origin=_pt.clone();
	}

	adjust_to(_rect, _type) {
		this.position.adjust_to(_rect, _type);
	}

	//!Must return the constant referring to the place where this object will live.
	get_collection_id() {
		throw new Error("Called get_collection_id on room_object base");
	}

	//!Must return the constant referring to the type of collision checking
	//!this class requests... Constants are defined in collision_checker_type.
	get_collision_checker_type() {
		throw new Error("Called get_collision_checker_type on room_object base");
	}

	//TODO: Fuck this... 
	//I'd rather request some "collision_response" object to implement
	//some sort of double dispatching.
	get_type() {
		console.error(this);
		throw new Error("Called get_type on room_object base");
	}
};

