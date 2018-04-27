"use strict";

//import {test_suite} from './core/test/rect.js';
//let m=new test_suite();


/*This is the main customization point where the kernel is loaded
with everything that is application specific.

The kernel needs to get injected with a display control (anything the 
controllers know about that can be use for drawing, so we are not stuck with
a single way of doing things) and with a few controllers that should
implement specific methods (do_input, do_draw, do_step...).
*/

import {kernel} from './core/kernel.js';

import {input_map} from './app/input_map.js';
import {display_control} from './app/display_control.js';
import {intro_controller} from './app/intro_controller.js';
import {map_load_controller} from './app/map_load_controller.js';
import {game_controller} from './app/game_controller.js';

function init() {

	let k=new kernel();

	//Load controllers...
	//TODO: This would be much better with unique tokens.
	k.inject_controller('intro', new intro_controller());
	k.inject_controller('game', new game_controller());
	k.inject_controller('map_load', new map_load_controller());
	k.set_active_controller('intro');

	//Setup specific systems: display and input.
	k.setup(new display_control(), input_map);

	//Load resources and be done...
	//TODO: Let these be defined in the app?
	let resources={
		'sprites' : 'assets/MiniKnightSet.png',
		'tiles' : 'assets/background_16.png'};

	k.init_loading_phase(resources)
	.then(() => {
		console.log("loading phase done");
		document.getElementById('btn_stop').addEventListener('click', () => {k.stop();});
		document.getElementById('btn_start').addEventListener('click', () => {k.start();});
	});
}

init();
