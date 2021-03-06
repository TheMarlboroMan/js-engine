"use strict"

import {message} from '../core/messages.js';
import {controller} from '../core/controller.js';
import {display_2d_manipulator} from '../core/display_2d_manipulator.js';
import {rgb_color, rgba_color} from '../core/display_tools.js';
import {point_2d} from '../core/point_2d.js';
import {rect, pos_inner_bottom, pos_inner_left, pos_left, pos_right} from '../core/rect.js';
import {camera_2d} from '../core/camera_2d.js';

import {draw_module} from './draw_module.js';
import {spritesheets} from './spritesheets.js';
import {room} from './room.js';
import {room_object_factory} from './room_object_factory.js';
import {deleter} from './deleter.js';
import {player, player_input} from './player.js';
import {axis_x, axis_y} from './moving_object.js';

export class game_controller extends controller {

	constructor() {
		super();
		this.clear_color=new rgb_color(0, 0, 0);
		this.camera=new camera_2d(new rect(new point_2d(0,0), 320, 208));
		this.room=new room();
		this.deleter=new deleter();
		this.ro_factory=new room_object_factory(this.deleter);
		//TODO: Might as well use the factory...
		//TODO: Maybe put it on the map too???
		this.player=new player(this.deleter);

		this.entry_id=1;
	}

	do_step(_delta, _input, _audio) {

		let pi=new player_input();

		if(_input.is_keydown('space')) 		{pi.y=-1;}
		else if(_input.is_keydown('down')) 	{this.try_player_attack();}

		if(_input.is_keypressed('left'))	{pi.x=-1;}
		else if(_input.is_keypressed('right'))	{pi.x=1;}

		//TODO: This is SHIT!. Do it better damn it!.
		this.player.get_input(pi, _audio);

		//TODO: Check the space below the player... is it free?
		//Do gravity and jump checks.

		//TODO: Fix "I can jump while falling".

		//TODO: Solve the collision thing with sense: keep an array of collisions, solve after each step, this
		//way each entity knows what to do.

		this.player.loop(_delta);
		if(this.player.must_create_attack()) {
			//TODO: Interesting thing... could the player have changed facing???
			this.ro_factory.make_and_store_player_attack(this.player.get_position(), this.player.is_facing_right(), this.room.rdc);
		}


		this.do_player_movement(_delta, axis_x);
		this.do_player_movement(_delta, axis_y);

		this.room.loop(_delta, this.player.position);

		if(this.deleter.can_perform_deletion()) {
			this.deleter.perform_deletion(this.room.rdc);
		}
	}

	do_draw(_display_control, _rm) {
		display_2d_manipulator.fill(_display_control.display, this.clear_color);

		this.camera.center_on(this.player.position.origin);

		//TODO: This is awful.. Like REALLY AWFUL.
		let r=function(_x, _y) {return new rect(new point_2d(_x, _y), 16, 16);};
		let gs=function(_k) {
			let y=Math.floor(_k / 7);
			let x=_k % 7;

			return r(x*16, y*16);
		};

		//Draw the place..
		//TODO: We can do this now.
		this.room.get_background().forEach((_item) => {
			display_2d_manipulator.draw_sprite(_display_control.display, this.camera, _rm.get_image('tiles'), r(_item.x*16, _item.y*16), gs(_item.type));
		});


		//TODO: The path is clear for this!!.
		//TODO: We have the sheet.
		//TODO: We just have to implement get_draw_info.
		this.room.get_enemies().forEach((_item) => {
			display_2d_manipulator.draw_rect(_display_control.display, this.camera, _item.get_position(), new rgba_color(128, 0, 0, 0.9));
		});

		draw_module.draw(this.player.get_draw_info(), _display_control, _rm, this.camera);

		this.room.get_player_attacks().forEach((_item) => {
			display_2d_manipulator.draw_rect(_display_control.display, this.camera, _item.get_position(), new rgba_color(0, 0, 128, 0.9));
		});
	}

	do_receive_message(_message) {

		switch(_message.type) {
			case 'map_loaded':
				this.room.from_map(_message.body, this.ro_factory);
				this.camera.set_limits(this.room.get_world_size_rect());
				this.place_player_at_entry(this.entry_id);
			break;
		}
	}

	awake() {
		console.log("game controller is awake");
	}

	slumber() {
		console.log("game goes to slumber");
	}

	/////

	//!Does the whole player loop.
	do_player_movement(_delta, _axis) {

		//TODO: The fun thing is that this would partly depend on the player
		//status... If dead, none of this should happen, but if I move
		//this logic inside the player, I have to make some stuff known
		//to it (like the world, get_tiles_in_rect and so on.

		this.player.save_last_known_position();
		this.player.do_movement(_axis, _delta);

		//TODO: We can add this shit in the collision_checker 
		//However, who decides what happens with the collisions???...

		//We get the tiles and filter the real collisions, in case we have irregular-shaped tiles.
		//Some other filters may be necccesary, like platform tiles that are not solid when the
		//player has -y vector...
		//TODO: Refactor.
		let tiles=this.room.get_tiles_in_rect(this.player.get_position())
			.filter((_item) => {
				if(!(this.player.get_position().collides_with(_item.get_position()))) {
					return false;
				}
				if(_item.is_platform()) {
					if(this.player.get_vector_y() >= 0.0 && this.player.last_position.is_over(_item.get_position())) {
						return true;
					}
					return false;
				}
				if(_item.blocks_enemies()) {
					return false;
				}
				return true;
			});

		//TODO: What about solid objects?.

		//Checking collisions with tiles.
		if(tiles.length) {
			if(tiles.every((_item) => {return _item.is_deadly();})) {
				this.kill_player();
			}
			else {
				this.player.process_collision(_axis, tiles.shift().get_position());
			}
		}

		//Checking collisions with objects.
		//TODO: About time to solve this with a proper collision_data object.
		let objects=this.room.get_map_objects_in_rect(this.player.get_position());
		for(let i=0; i < objects.length; i++) {
			//TODO: Absolutely terrible.
			switch(objects[i].get_type()) {
				case 'exit':
					this.entry_id=objects[i].entry_id;
					//TODO: I wonder... will this finish executing??
					this.state_controller.request_state_change("map_load");
					this.messenger.send(new message('load_map', objects[0].destination, ['map_load']));
					//TODO: This is meant to break from the loop ¬¬...
					break;
				return;
				case 'enemy':
					//TODO: if this ends up in the player we'll
					//need signals...
					this.kill_player();
				break;
				case 'entry': //TODO: Why?
				break;
			}
		}
	}

	kill_player() {

		//TODO: Changing the player status would be ideal, to some animation...
		//After the animation is done, we should be able to call some
		//player_reset method.
		this.place_player_at_entry(this.entry_id);
		this.player.stop();
		//TODO: Reset player status too, in case it was attacking
		//TODO: Clear player attacks. Reset the room, maybe.
	}

	place_player_at_entry(_entry_id) {

		let entry_box=this.room.get_entry_by_id(_entry_id).get_position();
		this.player.adjust_to(entry_box, pos_inner_bottom);
		this.player.adjust_to(entry_box, pos_inner_left);
	}

	//!If the player can attack, will set it in a pre-attack state.
	try_player_attack() {

		if(this.player.can_attack()) {
			//TODO: SORCERY!.
			this.player.start_attacking(0.5);
		}
	}
}
