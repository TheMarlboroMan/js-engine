"use strict"

import {rect} from '../core/rect.js';
import {point_2d} from '../core/point_2d.js';
import {map} from './map_loader.js';
import {patrolling_enemy} from './enemy.js';
import {axis_x} from './moving_object.js';
import {tile, tile_w, tile_h} from './tile.js';
import {draw_tile} from './draw_tile.js';
import {room_entry, room_exit} from './entry_exit.js';
import {room_data_container} from './room_data_container.js';

const obj_type_entry=1;
const obj_type_exit=2;
const obj_type_enemy=4;

export class room {

	constructor() {

		this.w=0;
		this.h=0;

		this.rdc=new room_data_container;
	}

	get_background() {
		return this.rdc.background;
	}

	get_enemis() {
		return this.rdc.enemies;
	}

	from_map(_map) {

		if(!(_map instanceof map)) {
			throw new Error("from_map must be called with a valid map");
		}

		this.rdc.clear();

		this.w=_map.w;
		this.h=_map.h;

		let process=(_source, _fn) => {
			_source.forEach((_item) => {
				if(_item.t) {
					_fn(_item);
				}
			});
		};

		let fn_tiles=(_item) => {
			this.rdc.tiles[""+this.get_index(_item.x, _item.y)]=new tile(_item.x, _item.y, _item.t);
		};

		let fn_back=(_item) => {
			this.rdc.background.push(new draw_tile(_item.x, _item.y, _item.t));
		};

		let fn_obj=(_item) => {

			//TODO: Create a factory, remove direct dependencies.
			switch(_item.t) {
				case obj_type_entry:
					this.rdc.entries.push(new room_entry(_item.x, _item.y, parseInt(_item.a.id, 10), parseInt(_item.a.facing, 10)));
				break;
				case obj_type_exit: 
					this.rdc.exits.push(new room_exit(_item.x, _item.y, _item.a.dest, parseInt(_item.a.entry_id, 10)));
				break;
				case obj_type_enemy: //By dumb luck we don't need to adjust positions... the enemy is as high as its tile, so there's no need to push it to the floor.
					this.rdc.enemies.push(new patrolling_enemy(_item.x*tile_w, _item.y*tile_h));
				break;
			}
		};

		process(_map.logic, fn_tiles);
		process(_map.objects, fn_obj);
		process(_map.background, fn_back);
	}

	//Returns the index of a tile in the hashed map.
	get_index(_x, _y) {
		//TODO: Check boundaries.
		return _x + (_y * this.w);
	}

	//!Gets the room entry (as in entry point).
	get_entry_by_id(_id) {
		let res=this.rdc.entries.find((_item) => {return _item.id===_id;});
		if(undefined===res) {
			throw new Error("Cannot find entry with id "+_id);
		}
		return res;
	}

	//!Returns all interactuable map objects in the rect.
	get_map_objects_in_rect(_rect) {

		let result=[];

		let f=(_item) => {
			if(_item.get_position().collides_with(_rect)) {
				result.push(_item);
			}
		};

		this.rdc.exits.forEach(f); 
		this.rdc.enemies.forEach(f);

		return result;
	}

	//!Returns all tiles bounded to the rectangle.
	get_tiles_in_rect(_rect) {

		let result=[];

		let begin_x=Math.floor(_rect.origin.x / tile_w);
		let begin_y=Math.floor(_rect.origin.y / tile_h);
		let end_x=Math.floor((_rect.origin.x+_rect.w) / tile_w);
		let end_y=Math.floor((_rect.origin.y+_rect.h) / tile_h);

		for(let x=begin_x; x <= end_x; x++) {
			for(let y=begin_y; y <= end_y; y++) {
				if(undefined!==this.rdc.tiles[this.get_index(x, y)]) {
					result.push(this.rdc.tiles[this.get_index(x, y)]);
				}
			}
		}

		return result;
	}

	//!Returns the room size.Notice that a padding of tile_w and tile_h
	//!is always reserved to fully enclose each room without bothering the camera.
	get_world_size_rect() {
		return new rect(new point_2d(tile_w,tile_h), (this.w-2)*tile_w, (this.h-2)*tile_h);
	}

	//!Makes all entities loop.
	loop(_delta, _player_pos) {

		this.rdc.enemies.forEach((_item) => {
			_item.loop(_delta, _player_pos);

			let tiles=this.get_tiles_in_rect(_item.position)
				.filter((_tile) => {
					return (_tile.is_solid() || _tile.blocks_enemies())
					&& _item.position.collides_with(_tile.position);
				});

			//TODO: The axis thing reeks. What if we need something that bounces up and down?
			if(tiles.length) {
				_item.process_collision(axis_x, tiles.shift().position);
			}

		});
	}
}
