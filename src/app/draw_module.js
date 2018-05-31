"use strict"

import {display_2d_manipulator} from '../core/display_2d_manipulator.js';

import {draw_info_type_rect, draw_info_type_sprite, draw_info_type_composite} from './draw_info.js';

export class draw_module {

	static draw(_draw_info, _display_control, _rm, _camera) {

		//TODO: Check types!

		switch(_draw_info.get_type()) {
			case draw_info_type_sprite:

				display_2d_manipulator.draw_sprite(
					_display_control.display, 
					_camera,
					_rm.get_image(_draw_info.resource),
					_draw_info.position,
					_draw_info.sprite_rect,
					_draw_info.invert);
			break;

			case draw_info_type_composite:
				_draw_info.info.forEach((_item) => {
					this.draw(_item, _display_control, _rm, _camera);
				});
			break;

			case draw_info_type_rect:

				display_2d_manipulator.draw_rect(
					_display_control.display, 
					_camera, 
					_draw_info.position,
					_draw_info.color);
			break;
		}
	}
}
