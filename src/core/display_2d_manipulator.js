"use strict"

import {rgb_color} from './display_tools.js';

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

	//TODO: Draw box.

	//TODO: Draw circle.

	//TODO: Draw sprite.
	//!_source must be a Image. _rect_pos and clip must be of type rect.
	static draw_sprite(_display, _source, _rect_pos, _rect_clip) {

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

		_display.context.drawImage(_source, sx, sy, sw, sh, dx, dy, dw, dh);
	}



}
