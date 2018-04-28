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

import {resource_index} from './app/resource_index.js';
import {input_map} from './app/input_map.js';
import {display_control} from './app/display_control.js';
import {intro_controller} from './app/intro_controller.js';
import {map_load_controller} from './app/map_load_controller.js';
import {game_controller} from './app/game_controller.js';

let k=null;

function init() {

	try {
		console.log("init...");

		k=new kernel();

		//Load controllers...
		//TODO: This would be much better with unique tokens.
		k.inject_controller('intro', new intro_controller());
		k.inject_controller('game', new game_controller());
		k.inject_controller('map_load', new map_load_controller());
		k.set_active_controller('intro');

		//Setup specific systems: display and input.
		k.setup(new display_control(), input_map);

		k.init_loading_phase(new resource_index())
		.then((_res) => {
			start();
		})
		.catch((_err) => {
			console.error("Error in loading phase: ",_err);
		});
	}
	catch(_err) {
		console.error("Error in init phase: ",_err);
	}
}

function start() {
	//This starts a different execution context...
	try {
		console.log("loading phase done");
		document.getElementById('btn_stop').addEventListener('click', () => {k.stop();});
		document.getElementById('btn_start').addEventListener('click', () => {k.start();});
		k.start();
	}
	catch(_err) {
		console.error("Error in ready phase: ",_err);
	}
}

init();
