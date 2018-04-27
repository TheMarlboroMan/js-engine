"use strict"

import {message} from '../core/messages.js';
import {controller} from '../core/controller.js';
import {display_2d_manipulator} from '../core/display_2d_manipulator.js';
import {rgb_color, rgba_color} from '../core/display_tools.js';
import {rect} from '../core/rect.js';
import {camera_2d} from '../core/camera_2d.js';

import {spritesheets} from './spritesheets.js';
import {room} from './room.js';
import {player, player_input} from './player.js';


export class game_controller extends controller {

	constructor() {
		super();
		this.clear_color=new rgb_color(0, 0, 0);
		this.camera=new camera_2d(0,0);
		this.room=new room();
		this.player=new player();
	}

	do_step(_delta, _input) {

		let pi=new player_input();

		if(_input.is_keydown('up')) 		{pi.y=-1;}
//		else if(_input.is_keypressed('down')) 	{}

		if(_input.is_keypressed('left'))	{pi.x=-1;}
		else if(_input.is_keypressed('right'))	{pi.x=1;}

/*
		if(_input.is_keydown('space')) {
			this.state_controller.request_state_change("main");
		}
		else if(_input.is_keydown('enter')) {
			this.messenger.send(new message(1, "Hola", ["main"]));
		}
*/

		this.player.get_input(pi);

		//TODO: Check the space below the player... is it free?
		//Do gravity and jump checks.

		//TODO: What if the player is out of bounds???
		this.player.save_last_known();
		this.player.loop_x(_delta);

		//TODO... Oh well...Time to return an array...
//		for(let i=0; i < this.room.tiles.length; i++) {
		for(let i in this.room.tiles) {
			let _item=this.room.tiles[i];
			if(this.player.position.collides_with(_item.position)) {
				this.player.process_collision_x(_item);
				break;
			}
		}

		this.player.save_last_known();
		this.player.loop_y(_delta);
//		for(let i=0; i< this.room.tiles.length; i++) {	
		for(let i in this.room.tiles) {
			let _item=this.room.tiles[i];
			if(this.player.position.collides_with(_item.position)) {
				this.player.process_collision_y(_item);
				break;
			}
		};
	}

	do_draw(_display_control, _rm) {
		display_2d_manipulator.fill(_display_control.display, this.clear_color);

		//TODO: Let us not repeat ourselves.
		//TODO. 32, 32???? What the fuck is this???
		let r=function(_x, _y) {return new rect(_x, _y, 32, 32);};
		let gh=function(_k, _f) {
			let t=spritesheets.get_hero(_k, _f);
			return r(t.x, t.y);
		};
		let gs=function(_k, _f) {
			let t=spritesheets.get_scenery(_k, _f);
			return r(t.x, t.y);
		};

		//Draw the place..
		this.room.background.forEach((_item) => {

			let key='solid';
			switch(_item.type) {
				case 1: key='solid'; break;
				case 2: key='bridge-left'; break;
				case 3: key='bridge-center'; break;
				case 4: key='bridge-right'; break;
			}


			//TODO: Move to another class.
			//TODO. No magic. 
			display_2d_manipulator.draw_sprite(_display_control.display, this.camera, _rm.get_image('tiles'), r(_item.x*16, _item.y*16), gs(key, 0));
		});

		display_2d_manipulator.draw_rect(_display_control.display, this.camera, this.player.position, new rgba_color(0, 128, 0, 64));
		//TODO: These are crude calculations...
		display_2d_manipulator.draw_sprite(_display_control.display, this.camera, _rm.get_image('sprites'), r(this.player.position.x-10, this.player.position.y-16), gh('stand', 0));

	}

	do_receive_message(_message) {

		switch(_message.type) {
			case 'map_loaded':
				this.room.from_map(_message.body); break;
		}
	}

	awake() {
		console.log("game controller is awake");
	}

	slumber() {
		console.log("game goes to slumber");
	}
}
