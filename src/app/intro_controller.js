"use strict"

import {message} from '../core/messages.js';
import {controller} from '../core/controller.js';
import {display_2d_manipulator} from '../core/display_2d_manipulator.js';
import {rgb_color} from '../core/display_tools.js';
import {rect} from '../core/rect.js';
import {camera_2d} from '../core/camera_2d.js';

import {spritesheets} from './spritesheets.js';

export class intro_controller extends controller {

	constructor() {
		super();
		this.clear_color=new rgb_color(0, 0, 0);
		this.camera=new camera_2d(0,0);
	}

	do_step(_delta, _input) {

		let camspeed=32.0;

		if(_input.is_keydown('up')) {
			this.camera.move_by(0, -camspeed*_delta);
		}
		else if(_input.is_keydown('down')) {
			this.camera.move_by(0, camspeed*_delta);
		}

		if(_input.is_keydown('left')) {
			this.camera.move_by(-camspeed*_delta, 0);
		}
		else if(_input.is_keydown('right')) {
			this.camera.move_by(camspeed*_delta, 0);
		}

		if(_input.is_keydown('space')) {
			this.state_controller.request_state_change("main");
		}
		else if(_input.is_keydown('enter')) {
			this.messenger.send(new message(1, "Hola", ["main"]));
		}
	}

	do_draw(_display_control, _rm) {
		display_2d_manipulator.fill(_display_control.display, this.clear_color);

		let r=function(_x, _y) {return new rect(_x, _y, 32, 32);};

		let gs=function(_k, _f) {
			let t=spritesheets.get_scenery(_k, _f);
			return r(t.x, t.y);
		};

		let gh=function(_k, _f) {
			let t=spritesheets.get_hero(_k, _f);
			return r(t.x, t.y);
		};

		//Draw the place..
		display_2d_manipulator.draw_sprite(_display_control.display, this.camera, _rm.get_image('tiles'), r(0, 64), gs('solid', 0));
		display_2d_manipulator.draw_sprite(_display_control.display, this.camera, _rm.get_image('tiles'), r(0, 96), gs('solid', 0));
		display_2d_manipulator.draw_sprite(_display_control.display, this.camera, _rm.get_image('tiles'), r(32, 64), gs('solid', 0));
		display_2d_manipulator.draw_sprite(_display_control.display, this.camera, _rm.get_image('tiles'), r(32, 96), gs('solid', 0));
		display_2d_manipulator.draw_sprite(_display_control.display, this.camera, _rm.get_image('tiles'), r(64, 64), gs('bridge-left', 0));
		display_2d_manipulator.draw_sprite(_display_control.display, this.camera, _rm.get_image('tiles'), r(96, 64), gs('bridge-center', 0));
		display_2d_manipulator.draw_sprite(_display_control.display, this.camera, _rm.get_image('tiles'), r(128, 64), gs('bridge-right', 0));

		//Draw the hero...
		display_2d_manipulator.draw_sprite(_display_control.display, this.camera, _rm.get_image('sprites'), r(32, 32), gh('stand', 0));
	}

	do_receive_message(_message) {
		console.log("intro controller got ", _message);
	}
}
