"use strict"

import {rgb_color} from './display_tools.js';
import {camera_2d} from './camera_2d.js';
import {rect} from './rect.js';

export class display_2d_manipulator {

	//!Fills the canvas with a specific color.
	static fill(_display, _color) {

		//TODO: Test with rgba...
		if(!_color instanceof rgb_color) {
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
		//TODO: Test with rgba...
		if(!_color instanceof rgb_color || !_rect instanceof rect) {
			throw new Error("canvas_manipulator::draw_rect should be called with a color and a rect");
		}

		let x=_rect.x, y=_rect.y, w=_rect.w, h=_rect.h;

		//TODO: Don't repeat yourself...
		if(null!==_camera) {
			if(!_camera instanceof camera_2d) {
				throw new Error("_camera parameter must be a camera object "+typeof _camera+" given");
			}

			x+=parseInt(_camera.x, 10);
			y+=parseInt(_camera.y, 10);
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

		let sx=0, sy=0, sw=_source.width, sh=_source.height;
		if(undefined!==_rect_clip) {
			sx=_rect_clip.x;
			sy=_rect_clip.y;
			sw=_rect_clip.w;
			sh=_rect_clip.h;
		}

		let 	dx=_rect_pos.x,
			dy=_rect_pos.y,
			dw=_rect_pos.w,
			dh=_rect_pos.h;

		//TODO: Don't repeat yourself...
		if(null!==_camera) {
			if(!_camera instanceof camera_2d) {
				throw new Error("_camera parameter must be a camera object "+typeof _camera+" given");
			}

			dx+=parseInt(_camera.x, 10);
			dy+=parseInt(_camera.y, 10);
		}

		_display.context.drawImage(_source, sx, sy, sw, sh, dx, dy, dw, dh);
	}



}
