"use strict"

import {message} from '../core/messages.js';
import {controller} from '../core/controller.js';
import {display_2d_manipulator, invert_none, invert_x} from '../core/display_2d_manipulator.js';
import {rgb_color, rgba_color} from '../core/display_tools.js';
import {point_2d} from '../core/point_2d.js';
import {rect} from '../core/rect.js';
import {camera_2d} from '../core/camera_2d.js';

import {spritesheets} from './spritesheets.js';
import {room} from './room.js';
import {player, player_input} from './player.js';


export class game_controller extends controller {

	constructor() {
		super();
		this.clear_color=new rgb_color(0, 0, 0);
		this.camera=new camera_2d(new rect(new point_2d(0,0), 320, 200));
		this.room=new room();
		this.player=new player();
	}

	do_step(_delta, _input) {

		let pi=new player_input();

		//TODO: I'd rather have a key like space...
		if(_input.is_keydown('space')) 		{pi.y=-1;}
//		else if(_input.is_keypressed('down')) 	{}

		if(_input.is_keypressed('left'))	{pi.x=-1;}
		else if(_input.is_keypressed('right'))	{pi.x=1;}

		this.player.get_input(pi);

		//TODO: Check the space below the player... is it free?
		//Do gravity and jump checks.

		//TODO: What if the player is out of bounds???
		this.player.save_last_known();
		this.player.loop_x(_delta);

		let tiles=this.room.get_tiles_in_rect(this.player.position);
		for(let i=0; i<tiles.length; i++) {
			let _item=tiles[i];
			if(this.player.position.collides_with(_item.position)) {
				this.player.process_collision_x(_item);
				break;
			}
		}

		this.player.save_last_known();
		this.player.loop_y(_delta);

		tiles=this.room.get_tiles_in_rect(this.player.position);
		for(let i=0; i<tiles.length; i++) {
			let _item=tiles[i];
			if(this.player.position.collides_with(_item.position)) {
				this.player.process_collision_y(_item);
				break;
			}
		};
	}

	do_draw(_display_control, _rm) {
		display_2d_manipulator.fill(_display_control.display, this.clear_color);

		//TODO: This is awful.
		//TODO: Let us not repeat ourselves.
		//TODO. No magic numbers...
		let r=function(_x, _y) {return new rect(new point_2d(_x, _y), 16, 16);};
		let hr=function(_x, _y) {return new rect(new point_2d(_x, _y), 32, 32);};
		let gh=function(_k, _f) {
			let t=spritesheets.get_hero(_k, _f);
			return hr(t.x, t.y);
		};
		let gs=function(_k) {return r(_k*16, 0);};

		this.camera.center_on(this.player.position.origin);

		//Draw the place..
		this.room.background.forEach((_item) => {
			//TODO: Move to another class.
			//TODO. No magic. 
			//TODO: The tile should actually know how to draw itself?
			display_2d_manipulator.draw_sprite(_display_control.display, this.camera, _rm.get_image('tiles'), r(_item.x*16, _item.y*16), gs(_item.type));
		});

		//TODO: The player should actually prepare the necessary information to be drawn.
		display_2d_manipulator.draw_rect(_display_control.display, this.camera, this.player.position, new rgba_color(0, 128, 0, 0.5));
		//TODO: These are crude calculations...
		display_2d_manipulator.draw_sprite(_display_control.display, this.camera, _rm.get_image('sprites'), hr(this.player.position.origin.x-10, this.player.position.origin.y-16), gh('stand', 0), this.player.is_facing_right() ? invert_none : invert_x);
	}

	do_receive_message(_message) {

		switch(_message.type) {
			case 'map_loaded':
				this.room.from_map(_message.body); 
				this.camera.set_limits(this.room.get_world_size_rect()); 
				//TODO.Add a logic to the exit.
//				this.player.move_to(new point_2d(64,0));
				this.player.move_to(new point_2d(32,0));
			break;
		}
	}

	awake() {
		console.log("game controller is awake");
	}

	slumber() {
		console.log("game goes to slumber");
	}
}
