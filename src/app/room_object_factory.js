"use strict"

import {deleter} from './deleter.js';
import {tile, tile_w, tile_h} from './tile.js';
import {patrolling_enemy} from './enemy.js';
import {room_entry, room_exit} from './entry_exit.js';
import {player_attack} from './player_attack.js';
import {pos_left, pos_right} from '../core/rect.js';

const obj_type_entry=1;
const obj_type_exit=2;
const obj_type_enemy=4;


export class room_object_factory {

	constructor(_gc) {

		if(!(_gc instanceof deleter)) {
			throw new Error("room_object_factory must be constructed with a deleter");
		}

		this.gc=_gc;
	}

	//_item is an anonymous json object, straight from the map file.
	make_and_store_room_object(_item, _rdc) {
		switch(_item.t) {
			case obj_type_entry:
				_rdc.entries.push(this.make_room_entry(_item));
			break;
			case obj_type_exit: 
				_rdc.exits.push(this.make_room_exit(_item));
			break;
			case obj_type_enemy:
				_rdc.enemies.push(this.make_enemy(_item));
			break;
		}
	}

	make_and_store_player_attack(_rect, _face_right, _rdc) {
		let pa=this.make_player_attack(_rect, _face_right);
		_rdc.player_attacks.push(pa);
		return pa;
	}

	make_player_attack(_rect, _face_right) {
		let pa=new player_attack(this.gc);
		pa.attach_to(_rect, _face_right ? pos_right : pos_left);
		return pa;
	}

	make_room_entry(_item) {

		let x=parseInt(_item.x, 10)*tile_w;
		let y=parseInt(_item.y, 10)*tile_h;
		return new room_entry(x, y, tile_w, tile_h, parseInt(_item.a.id, 10), parseInt(_item.a.facing, 10), this.gc);
	}

	make_room_exit(_item) {
		let x=parseInt(_item.x, 10)*tile_w;
		let y=parseInt(_item.y, 10)*tile_h;
		return new room_exit(x, y, tile_w, tile_h, _item.a.dest, parseInt(_item.a.entry_id, 10), this.gc);
	}

	 //By dumb luck we don't need to adjust positions... the enemy is as high as its tile, so there's no need to push it to the floor.
	make_enemy(_item) {
		let x=parseInt(_item.x, 10)*tile_w;
		let y=parseInt(_item.y, 10)*tile_h;
		return new patrolling_enemy(x, y, this.gc);
	}

	make_tile(_item) {
		return new tile(_item.x, _item.y, _item.t, this.gc);
	}
}
