"use strict"

export const draw_info_type_composite=0;
export const draw_info_type_rect=1;
export const draw_info_type_sprite=2;

class draw_info {

	constructor() {

	}

	get_type() {
		throw new Error("called get_type on base draw_info class");
	}
}

export class draw_info_composite extends draw_info{

	constructor() {

		super();
		this.info=[];
	}

	add(_di) {
		//TODO: Check types...
		this.info.push(_di);
	}

	get_type()  {
		return draw_info_type_composite;
	}
}

export class draw_info_positional extends draw_info {

	constructor(_pos) {

		super();
		//TODO: Check types!!!
		this.position=_pos;
	}
}

export class draw_info_rect extends draw_info_positional {

	constructor(_pos, _col) {

		super(_pos);

		//TODO: Check types!!!
		this.color=_col;
	}

	get_type() {
		return draw_info_type_rect;
	}
}

export class draw_info_sprite extends draw_info_positional {

	constructor(_pos, _resource, _sprite, _invert) {

		super(_pos);

		//TODO: Check types!!!
		this.resource=_resource;
		this.sprite_rect=_sprite;
		this.invert=_invert;
	}

	get_type() {
		return draw_info_type_sprite;
	}

}
