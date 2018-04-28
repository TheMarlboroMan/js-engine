"use strict"

import {rgb_color} from './display_tools.js';
import {camera_2d} from './camera_2d.js';
import {rect} from './rect.js';

export class display_2d_manipulator {

	//!Fills the canvas with a specific color.
	static fill(_display, _color) {

		//TODO: Test with rgba...
		if(!(_color instanceof rgb_color)) {
			throw new Error("canvas_manipulator::clear should be called with a color");
		}

		_display.context.fillStyle=_color.as_style();
		_display.context.fillRect(0, 0, _display.canvas.width, _display.canvas.height);
	}

	//!Clears the canvas.
	static clear(_display) {
		_display.context.clearRect(0, 0, _display.canvas.width, _display.canvas.height);
	}

	//TODO: Draw poly.

	static draw_rect(_display, _camera, _rect, _color) {

		//TODO: Don't draw if outside camera!!!.
		//TODO: Test that!.

		if(null!==_camera) {
			if(!(_camera instanceof camera_2d)) {
				throw new Error("_camera parameter must be a camera object "+typeof _camera+" given");
			}

			if(!_rect.collides_with(_camera.position)) {
				return;
			}
		}

		//TODO: Test with rgba...
		if(!(_color instanceof rgb_color) || !(_rect instanceof rect)) {
			throw new Error("canvas_manipulator::draw_rect should be called with a color and a rect");
		}



		let x=_rect.origin.x, y=_rect.origin.y, w=_rect.w, h=_rect.h;

		//TODO: Don't repeat yourself...
		if(null!==_camera) {
			x-=parseInt(_camera.position.origin.x, 10);
			y-=parseInt(_camera.position.origin.y, 10);
		}

		_display.context.fillStyle=_color.as_style();
		_display.context.fillRect(x, y, w, h);
	}

	//TODO: Draw circle.

	//!_display is a display_2d object.
	//!_source must be a Image. _rect_pos and clip must be of type rect.
	//!_source can be obtained from the resource_manager class.

	//TODO Not really sure about this kind of interface...
	static draw_sprite(_display, _camera, _source, _rect_pos, _rect_clip) {

		//TODO: Don't draw if outside camera!!!.
		//TODO: Test that!.

		if(null!==_camera) {
			if(!(_camera instanceof camera_2d)) {
				throw new Error("_camera parameter must be a camera object "+typeof _camera+" given");
			}

			if(!_rect_pos.collides_with(_camera.position)) {
				return;
			}
		}

		if(!(_rect_pos instanceof rect)) {
			throw new Error("_rect_pos for draw_sprite must be a rect");
		}

		let sx=0, sy=0, sw=_source.width, sh=_source.height;
		if(undefined!==_rect_clip) {

			if(!(_rect_clip instanceof rect)) {
				throw new Error("_rect_clip for draw_sprite must be a rect");
			}

			sx=_rect_clip.origin.x;
			sy=_rect_clip.origin.y;
			sw=_rect_clip.w;
			sh=_rect_clip.h;
		}

		let 	dx=_rect_pos.origin.x,
			dy=_rect_pos.origin.y,
			dw=_rect_pos.w,
			dh=_rect_pos.h;

		//TODO: Don't repeat yourself...
		if(null!==_camera) {
			dx-=parseInt(_camera.position.origin.x, 10);
			dy-=parseInt(_camera.position.origin.y, 10);
		}

		_display.context.drawImage(_source, sx, sy, sw, sh, dx, dy, dw, dh);
//		throw new Error("shit!");
	}

	static check_camera_limits() {

	}

}
