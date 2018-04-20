"use strict";

/*This is the main customization point where the kernel is loaded
with everything that is application specific.

The kernel needs to get injected with a display control (anything the 
controllers know about that can be use for drawing, so we are not stuck with
a single way of doing thing) and with a few controllers that should
implement specific methods (do_input, do_draw, do_step...).
*/

import {kernel} from './core/kernel.js';
import {input_keymap_creator} from './core/input_tools.js';

import {display_control} from './app/display_control.js';
import {intro_controller} from './app/intro_controller.js';
import {main_controller} from './app/main_controller.js';

let k=new kernel();

//Setup specific systems: display and input.
let ifc=new input_keymap_creator();

//TODO: This goes better into an app file and then ifc.add(array);

//TODO: Again, better with unique tokens.
ifc.add('space', 32);
ifc.add('up', 38);
ifc.add('down', 40);
ifc.add('left', 37);
ifc.add('right', 39);
ifc.add('enter', 13);

//Load controllers...
//TODO: This would be much better with unique tokens.
k.inject_controller('intro', new intro_controller());
k.inject_controller('main', new main_controller());
k.set_active_controller('intro');

k.setup(new display_control(), ifc.get_keymap());

//Load resources and be done...
let resources={'sprites' : 'assets/MiniKnightSet.png',
	'tiles' : 'assets/tileset_32_0.png'};

k.init_loading_phase(resources)
.then(() => {
	console.log("loading phase done");
	document.getElementById('btn_stop').addEventListener('click', () => {k.stop();});
	document.getElementById('btn_start').addEventListener('click', () => {k.start();});
});
