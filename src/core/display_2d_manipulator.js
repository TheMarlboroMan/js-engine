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



}
